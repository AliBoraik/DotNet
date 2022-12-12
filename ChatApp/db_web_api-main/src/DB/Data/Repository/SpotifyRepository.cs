﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;
using DB.Data;
using DB.Models;
using DB.Models.EnumTypes;
using DB.Models.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DB.Data.Repository;

public class SpotifyRepository : ISpotifyRepository
{
    private readonly SpotifyContext _ctx;
    private readonly UserManager<UserInfo> _userManager;

    public SpotifyRepository(SpotifyContext ctx, UserManager<UserInfo> userManager)
    {
        _ctx = ctx;
        _userManager = userManager;
    }
    
    //Operations with songs
    public async Task<IEnumerable<Song>> GetSongs()
    {
        return await _ctx.Songs.ToListAsync();
    }
    public async Task<bool> LikeSong(int songId, string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            var song = await _ctx.Songs.FindAsync(songId);
            var likedSongsPlaylist = await _ctx.Playlists
                .Where(k => k.UserId == userId && k.PlaylistType == PlaylistType.LikedSongs)
                .FirstOrDefaultAsync();
            
            //if any is empty
            if (likedSongsPlaylist == null || song == null || user == null) return false;

            likedSongsPlaylist.Songs.Add(song);
            _ctx.Playlists.Update(likedSongsPlaylist);
            await _ctx.SaveChangesAsync();

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }
    
    public async Task<bool> DeleteLikeSong(int songId, string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            var song = await _ctx.Songs.FindAsync(songId);
            var likedSongsPlaylist = await _ctx.Playlists.Include(x=>x.Songs)
                .Where(k => k.UserId == userId && k.PlaylistType == PlaylistType.LikedSongs)
                .FirstOrDefaultAsync();
            
            //if any is empty
            if (likedSongsPlaylist == null || song == null || user == null) return false;
            likedSongsPlaylist.Songs.Remove(song);
            _ctx.Playlists.Update(likedSongsPlaylist);
            await _ctx.SaveChangesAsync();

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }
    
    

    public async Task<bool> AddSongToPlaylist(int songId, int playlistId)
    {
        try
        {
            var userId = _ctx.Songs.FirstOrDefaultAsync(x=>x.Id==songId).Result!.UserId;
            var song = _ctx.Songs.FirstOrDefaultAsync(x => x.Id == songId).Result;
            
            var songPlaylist = await _ctx.Playlists
                .Where(k => k.UserId == userId && k.Id == playlistId)
                .FirstOrDefaultAsync();
            
            if (songPlaylist == null || song == null || userId == null) return false;
            
            songPlaylist.Songs.Add(song);
            _ctx.Playlists.Update(songPlaylist);
            await _ctx.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<SongResponse?> GetSong(int songId)
    {
        var song = await _ctx.Songs
            .FirstOrDefaultAsync(x => x.Id == songId);
        var playlist = await _ctx.Playlists.FirstOrDefaultAsync(p => p.Id == song.OriginPlaylistId);
        if (song != null && playlist != null)
            return new SongResponse()
            {
                Id = song.Id,
                UserId = song.UserId,
                Name = song.Name,
                Source = song.Source,
                OriginPlaylistId = song.OriginPlaylistId,
                OriginPlaylistTitle = playlist.Title,
            };
        return null;
    }

    public async Task<object> GetLikedSongs(string userId)
    {
        var likedPlaylist =await _ctx.Playlists
            .Include(x => x.Songs)
            .Where(x => x.PlaylistType == PlaylistType.LikedSongs && x.UserId == userId)
            .Select(s => new
            {
                s.Id, s.Title, s.PlaylistType, s.GenreType, s.UserId,
                Songs = s.Songs.Select(w => new
                {
                    w.Id, w.Name, w.Source, w.UserId, w.OriginPlaylistId
                })
            }).FirstOrDefaultAsync();
        
        if (likedPlaylist == null) return null;  
        
        return likedPlaylist;
    }
    
    public async Task<List<SongResponse>> SearchSongs(string input)
    {
        var songs = await _ctx.Songs.Include(p => p.Playlists)
            .AsSplitQuery()
            .Where(p => p.Name.ToUpper().Contains(input.ToUpper()))
            .Select(s => new SongResponse()
            {
                Id = s.Id, 
                UserId = s.UserId,
                Name = s.Name, 
                Source = s.Source, 
                OriginPlaylistId = s.OriginPlaylistId,
                OriginPlaylistTitle = s.Playlists.First(p => p.Id == s.OriginPlaylistId).Title
            })
            .ToListAsync();
        return songs;
    }
    
    //Operations with playlists
    public async Task<IEnumerable<Playlist>> GetAllPlaylists()
    { 
        return await _ctx.Playlists.ToListAsync();
    }

    public int GetPlaylistsCount()
    {
        return _ctx.Playlists.Count();
    }

    public async Task<IEnumerable<Playlist>> GetRandomPlaylists(int count)
    {
        return await _ctx.Playlists.OrderBy(r => Guid.NewGuid()).Take(count).ToListAsync();
    }
    public async Task<IEnumerable<Playlist>> GetUsersPlaylists(string userId)
    {
        var usersPlaylists = await _ctx.Playlists
            .Include(x => x.Songs)
            .Include(x => x.Users)
            .AsSplitQuery()
            .Where(k => k.UserId == userId && k.PlaylistType != PlaylistType.LikedSongs) 
            .ToListAsync();
        return usersPlaylists;
    }
    
    public async Task<bool> CreatePlaylist(Playlist newPlaylist)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(newPlaylist.UserId);
            
            var test = new Playlist
            {
                UserId = user.Id,
                Title = newPlaylist.Title,
                PlaylistType = newPlaylist.PlaylistType,
                GenreType = newPlaylist.GenreType,
                Verified = true
            };
            
            test.Users.Add(user);
            await _ctx.AddAsync(test);
            await _ctx.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
        
    }
    
    public async Task<bool> LikePlaylist(int playlistId, string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            var playlist = await _ctx.Playlists.FindAsync(playlistId);
            //if any is empty
            if (playlist == null || user == null) return false;

            playlist.Users.Add(user);
            _ctx.Playlists.Update(playlist);
            await _ctx.SaveChangesAsync();

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<List<Playlist>> SearchPlaylists(string input)
    {
        
        var result = await _ctx.Playlists
            .Where(p => 
                p.PlaylistType != PlaylistType.LikedSongs 
                && p.Title.ToUpper().Contains(input.ToUpper()))
            .ToListAsync();
        return result;
    }

    public async Task<Playlist?> GetPlaylistInfo(int playlistId)
    {
        var playlist = await _ctx.Playlists
            .Include(x => x.Songs)
            .Include(x => x.Users)
            .AsSplitQuery()
            .Where(k => k.Id == playlistId)
            .FirstOrDefaultAsync();
        return playlist;
    }

    public async Task<bool> EditPlaylist(Playlist newPlaylist)
    {
        try
        {
            var ctxPlaylist = await _ctx.Playlists.FindAsync(newPlaylist.Id);
            if (ctxPlaylist != null)
            {
                ctxPlaylist.Title = newPlaylist.Title;
                if (newPlaylist.ImgSrc != null && newPlaylist.ImgSrc != ctxPlaylist.ImgSrc)
                {
                    ctxPlaylist.ImgSrc = newPlaylist.ImgSrc;
                }

                _ctx.Playlists.Update(ctxPlaylist);
                await _ctx.SaveChangesAsync();
                return true;
            }

            return false;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> DeletePlaylist(int playlistId, string userId)
    {
        try
        {
            var currentPlaylist = await _ctx.Playlists.FindAsync(playlistId);
            if (currentPlaylist != null & currentPlaylist!.UserId == userId)
            {
                _ctx.Remove(currentPlaylist);
                
                await _ctx.SaveChangesAsync();
                return true;
            }
            return false;
            
        }
        catch (Exception)
        {
            return false;
        }
    }
    
    //Operations with users
    public async Task<string> GetUserName(string userId)
    {
        var name = await _ctx.Profiles.FirstOrDefaultAsync(u => u.UserId == userId);
        return name!=null ? name.Username : "user" ;
    }

    public async Task<UserInfo?> FindUserByIdAsync(string userId)
    {
        return await _userManager.FindByIdAsync(userId);  
    } 
    
    public async Task<IEnumerable<Playlist>?> GetUserLibrary(string userId)
    {
        if (await _ctx.Users.FirstOrDefaultAsync(u => u.Id == userId) == null) return null;
        var userLibrary = await _ctx.Users
            .Include(p => p.Playlists)
            .ThenInclude(s => s.Songs)
            .AsSplitQuery()
            .Where(u => u.Id == userId)
            .ToListAsync();
        return userLibrary.SelectMany(s => s.Playlists);
    }

    public async Task<IEnumerable<Playlist>?> GetRandomPlaylistsByGenre(GenreType genreType)
    {
        var playlistsByGenre = await _ctx.Playlists
            .Include(p => p.Songs)
            .OrderBy(r => Guid.NewGuid())
            .AsSplitQuery()
            .Where(p => p.GenreType == genreType)
            .Take(new Random().Next(10,30))
            .ToListAsync();
        return playlistsByGenre;
    }


    //Operations with profiles
    public async Task<bool> CreateProfileAsync(Profile newProfile)
    {
        try
        {
            await _ctx.Profiles.AddAsync(newProfile);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<List<Profile>> SearchProfile(string input, bool isArtist)
    {
        var userType = UserType.User;
        if (isArtist)
            userType = UserType.Artist;
        var result = await _ctx.Profiles
            .Where(p => p.UserType == userType)
            .Where(p => p.Username!.ToUpper().Contains(input.ToUpper()))
            .ToListAsync();
        return result;
    }

    public async Task<ProfileResponse?> GetProfile(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        var profile = await _ctx.Profiles
            .FirstOrDefaultAsync(x => x.UserId == userId);
        if (user != null && profile != null)
            return new ProfileResponse()
            {
                Email = user.Email,
                Username = profile.Username,
                Birthday = profile.Birthday,
                Country = profile.Country,
                ProfileImg = profile.ProfileImg
            };
        return null;
    }

    public async Task<bool> ChangeProfile(string userId, string? username, Country? country, string? birthday, string? email)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            var profile = _ctx.Profiles.FirstOrDefault(x => x.UserId == userId);          
            DateOnly date;
            if (user != null)
            {
                if (birthday != null)
                {
                    date = Parse(birthday);
                    profile!.Birthday = date;
                }

                if (username != null)
                {
                    profile!.Username = username;
                    user.NormalizedUserName = username.ToUpper();
                }

                if (email != null)
                {
                    user.Email = email;
                    user.NormalizedEmail = email.ToUpper();
                }

                if (country != null)
                {
                    profile!.Country = country;
                }
                
                await _userManager.UpdateAsync(user);
                
                _ctx.Profiles.Update(profile!);
                await _ctx.SaveChangesAsync();
                
                return true;
            }

            return false;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> ChangePremium(string userId, int premiumId)
    {
        try
        {
            var isContain = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == userId);
            var premium = _ctx.UserPremiums.FirstOrDefaultAsync(x => x.UserId == userId).Result;
            if (isContain != null && premium == null)
            {
                var newPremium = new UserPremium
                {
                    UserId = userId,
                    PremiumId = premiumId,
                    StartAt = DateTime.Now,
                    EndAt = DateTime.Now.AddMonths(1)
                };

                await _ctx.UserPremiums.AddAsync(newPremium);
                var res = await _ctx.SaveChangesAsync();
                return res != 0;
            }

            if (premium.PremiumId == premiumId)
                return false;
            premium.PremiumId = premiumId;
            DateTime date = DateTime.Now;
            premium.StartAt = date;
            premium.EndAt = date.AddMonths(1);
            
            _ctx.UserPremiums.Update(premium);
            await _ctx.SaveChangesAsync();
            
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> ChangePassword(UserInfo user, string oldPassword, string newPassword)
    {
        try
        {
            if (oldPassword == newPassword)
            {
                return false;
            }

            var result = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);
            if (result.Succeeded)
            {
                await _ctx.SaveChangesAsync();
                return true;
            }
            return false;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<Premium?> GetUserPremium(string userId)
    {
        var userPremium = await _ctx.UserPremiums.FirstOrDefaultAsync(p => p.UserId == userId);
        if (userPremium == null)
            return null;
        var premium = await _ctx.Premiums.FirstOrDefaultAsync(p => p.Id == userPremium.PremiumId);
        return premium;
    }

    public async Task<Premium?> GetPremium(int premiumId)
    {
        var premium = await _ctx.Premiums.FirstOrDefaultAsync(p => p.Id == premiumId);
        return premium ?? null;
    }

    public async Task<List<Premium>?> GetAvailablePremiums(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return null;
        var userPremium = await GetUserPremium(userId);
        if(userPremium != null)
            return await _ctx.Premiums.Where(p => p.Id != userPremium.Id).ToListAsync();
        return await _ctx.Premiums.ToListAsync();
    }

    public static DateOnly Parse(string s)
    {
        var str = s.Split('.');

        int[] array = new int[3];
        array[0] = int.Parse(str[0]);
        array[1] = int.Parse(str[1]);
        array[2] = int.Parse(str[2]);

        return new DateOnly(array[0], array[1], array[2]);
    }

    //Other operations
    public async Task Save()
    {
        await _ctx.SaveChangesAsync();
    }
    public async Task LikeAllSongs(UserInfo user)
    {
        var songs = await _ctx.Songs.ToListAsync();
        var playlist = await _ctx.Playlists.FirstAsync();
        //like song
        foreach (var song in songs) playlist.Songs.Add(song);
        playlist.Users.Add(user); //TODO нужно чтобы по дефолту при
        //создании пользователя у него был плейлист LikedSongs
        //а при создании плейлиста пользователем надо их связать через индекс LikedPlaylists
        _ctx.Playlists.Update(playlist);
        await Save();
        /*var isContain = await _ctx.Playlists.ContainsAsync(playlist);
        if (!isContain)
        {
            _ctx.Playlists.Update(playlist);
            await _ctx.SaveChangesAsync();
        }*/
    }

    public async Task<bool> IsSongLiked(string uId, int sId)
    {
        var res = await _ctx.Playlists
            .Where(p=>p.UserId == uId && p.PlaylistType == PlaylistType.LikedSongs)
            .Include(w => w.Songs).SelectMany(s=>s.Songs).FirstOrDefaultAsync(s=>s.Id==sId);

        return res!=null;
    }

    public void Dispose()
    {
        _ctx.Dispose();
        _userManager.Dispose();
    }
}