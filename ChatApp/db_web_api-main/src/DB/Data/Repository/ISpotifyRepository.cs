﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DB.Models;
using DB.Models.EnumTypes;
using DB.Models.Responses;

namespace DB.Data.Repository;

public interface ISpotifyRepository : IDisposable
{
    //Operations with songs
    Task<IEnumerable<Song>> GetSongs(); 
    Task<bool> LikeSong(int songId, string userId);
    Task<bool> DeleteLikeSong(int songId, string userId);
    Task<bool> AddSongToPlaylist(int songId, int playlistId);
    Task<SongResponse?> GetSong(int songId);
    Task<object> GetLikedSongs(string userId);
    Task<List<SongResponse>> SearchSongs(string input);
    
    //Operations with playlists
    Task<IEnumerable<Playlist>> GetAllPlaylists();
    int GetPlaylistsCount();
    Task<IEnumerable<Playlist>> GetRandomPlaylists(int count);
    Task<IEnumerable<Playlist>> GetUsersPlaylists(string userId);
    Task<bool> CreatePlaylist(Playlist newPlaylist);
    Task<bool> LikePlaylist(int playlistId, string userId); //+
    Task<List<Playlist>> SearchPlaylists(string input);
    
    /// <summary>
    ///     Асинхронно возвращает Task плейлист, со всей инфорацией о пользователях и песнях
    /// </summary>
    /// <param name="playlistId"> <see cref="string" /></param>
    /// <returns>
    ///     The task result contains a <see cref="Playlist" /> 
    /// </returns>
    Task<Playlist?> GetPlaylistInfo(int playlistId);
    Task<bool> EditPlaylist(Playlist newPlaylist);
    Task<bool> DeletePlaylist(int playlistId, string userId);
    
    //Operations with users
    Task<string> GetUserName(string userId);
    Task<UserInfo?> FindUserByIdAsync(string userId);
    Task<IEnumerable<Playlist>?> GetUserLibrary(string userId);
    Task<IEnumerable<Playlist>?> GetRandomPlaylistsByGenre(GenreType genreType);

    //Operations with profiles
    Task<bool> CreateProfileAsync(Profile newProfile);
    Task<List<Profile>> SearchProfile(string input, bool isArtist);
    Task<ProfileResponse?> GetProfile(string userId);
    Task<bool> ChangeProfile(string userId, string? username, Country? country, string? birthday, string? email);
    Task<bool> ChangePremium(string userId, int premiumId);
    Task<bool> ChangePassword(UserInfo user, string oldPassword, string newPassword);
    Task<Premium?> GetUserPremium(string userId);
    Task<Premium?> GetPremium(int premiumId);
    Task<List<Premium>?> GetAvailablePremiums(string userId);

    //Other operations
    Task Save();
    Task LikeAllSongs(UserInfo user);

    Task<bool> IsSongLiked(string uId, int sId);
}