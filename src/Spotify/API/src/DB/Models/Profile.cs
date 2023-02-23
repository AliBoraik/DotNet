﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using DB.Models.EnumTypes;

namespace DB.Models
{
    [Table("profile")]
    public class Profile
    {
        [Key]
        [Column("user_id")]
        public string UserId { get; set; } = null!;

        [Column("username")]
        [StringLength(255)]
        public string Username { get; set; }
        
        [Column("birthday")]
        public DateOnly? Birthday { get; set; }
        
        [Column("country")]
        public Country? Country { get; set; }
        
        [Column("profile_img")]
        [StringLength(255)]
        public string? ProfileImg { get; set; }
        
        [Column("user_type")]
        public UserType UserType { get; set; }
        
        
        [JsonIgnore]
        [ForeignKey("UserId")]
        [InverseProperty("Profile")]
        public UserInfo? User { get; set; }
    }
}
