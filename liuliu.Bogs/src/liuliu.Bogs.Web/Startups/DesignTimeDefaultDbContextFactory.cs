﻿// -----------------------------------------------------------------------
//  <copyright file="DesignTimeDefaultDbContextFactory.cs" company="OSharp开源团队">
//      Copyright (c) 2014-2020 OSharp. All rights reserved.
//  </copyright>
//  <site>http://www.osharp.org</site>
//  <last-editor>郭明锋</last-editor>
//  <last-date>2020-08-25 23:16</last-date>
// -----------------------------------------------------------------------

using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

using OSharp.Entity;


namespace liuliu.Bogs.Web.Startups
{
    //public class DesignTimeDefaultDbContextFactory : DesignTimeDbContextFactoryBase<DefaultDbContext>
    //{
    //    public DesignTimeDefaultDbContextFactory()
    //        : base(null)
    //    { }

    //    public DesignTimeDefaultDbContextFactory(IServiceProvider serviceProvider)
    //        : base(serviceProvider)
    //    { }

    //    public override string GetConnectionString()
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public override IEntityManager GetEntityManager()
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public override bool LazyLoadingProxiesEnabled()
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public override DbContextOptionsBuilder UseSql(DbContextOptionsBuilder builder, string connString)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    /// <summary>
    //    /// 创建设计时使用的ServiceProvider，主要用于执行 Add-Migration 功能
    //    /// </summary>
    //    /// <returns></returns>
    //    protected override IServiceProvider CreateDesignTimeServiceProvider()
    //    {
    //        IServiceCollection services = new ServiceCollection();
    //        Startup startup = new Startup();
    //        startup.ConfigureServices(services);
    //        IServiceProvider provider = services.BuildServiceProvider();
    //        return provider;
    //    }
    //}
}
