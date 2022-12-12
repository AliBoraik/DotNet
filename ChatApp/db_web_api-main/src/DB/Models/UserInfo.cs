﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace DB.Models
{
    [Table("user_info")]
    public class UserInfo:IdentityUser
    {
        public UserInfo()
        {
            //PlaylistsNavigation = new HashSet<Playlist>();
            Songs = new HashSet<Song>();
            Playlists = new HashSet<Playlist>();
        }
        [Key]
        [Column("id")]
        public override string Id { get; set; } = null!;
        
        [Column("email")]
        [StringLength(255)]
        public override string Email { get; set; } = null!;
        
        

        [InverseProperty("User")]
        public UserPremium UserPremium { get; set; } = null!;

        [InverseProperty("User")]
        public Profile Profile { get; set; } = null!;
        
        [JsonIgnore]
        [InverseProperty("User")]
        public ICollection<Song> Songs { get; set; }
        
        //плейлисты, которые юзер лайкнул many-many
        //(созданные становятся лайкнутыми автоматом)
        [JsonIgnore]
        public ICollection<Playlist> Playlists { get; set; }
    }
}
