using ManageCar.Data;
using ManageCar.Models;
using System.Collections.Generic;
using AutoMapper;
using System;

namespace ManageCar.AutoMapperProfile
{
    public class AutoMapperProfileConfiguration : Profile
    {
        public AutoMapperProfileConfiguration()
        : this("MyProfile")
        {
        }
        protected AutoMapperProfileConfiguration(string profileName)
        : base(profileName)
        {
            CreateMap<Car, CarViewModel>();
            CreateMap<CarViewModel, Car>();
        }
    }
}