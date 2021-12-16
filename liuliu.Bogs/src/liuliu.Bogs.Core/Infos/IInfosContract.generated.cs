// -----------------------------------------------------------------------
// <auto-generated>
//    此代码由代码生成器生成。
//    手动更改此文件可能导致应用程序出现意外的行为。
//    如果重新生成代码，对此文件的任何修改都会丢失。
//    如果需要扩展此类，可以遵守如下规则进行扩展：
//      1. 横向扩展：如需给当前模块添加方法接口，可新建文件“IInfosContract.cs”的分部接口“public partial interface IInfosContract”添加方法，并添加相应新的分部基类 abstract partial class InfosServiceBase 实现新方法
// </auto-generated>
//
//  <copyright file="IInfosContract.generated.cs" company="OSharp开源团队">
//      Copyright (c) 2014-2019 Liuliu. All rights reserved.
//  </copyright>
//  <site>https://www.osharp.org</site>
//  <last-editor>郭明锋</last-editor>
// -----------------------------------------------------------------------

using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

using OSharp.Data;
using OSharp.Extensions;

using liuliu.Bogs.Infos.Dtos;
using liuliu.Bogs.Infos.Entities;


namespace liuliu.Bogs.Infos
{
    /// <summary>
    /// 业务契约接口：信息模块
    /// </summary>
    public partial interface IInfosContract
    {
        #region 站内信信息业务

        /// <summary>
        /// 获取 站内信信息查询数据集
        /// </summary>
        IQueryable<Message> Messages { get; }

        /// <summary>
        /// 检查站内信信息信息是否存在
        /// </summary>
        /// <param name="predicate">检查谓语表达式</param>
        /// <param name="id">更新的站内信信息编号</param>
        /// <returns>站内信信息是否存在</returns>
        Task<bool> CheckMessageExists(Expression<Func<Message, bool>> predicate, Guid id = default(Guid));
        
        /// <summary>
        /// 添加站内信信息信息
        /// </summary>
        /// <param name="dtos">要添加的站内信信息DTO信息</param>
        /// <returns>业务操作结果</returns>
        Task<OperationResult> CreateMessages(params MessageInputDto[] dtos);
            
        /// <summary>
        /// 更新站内信信息信息
        /// </summary>
        /// <param name="dtos">包含更新信息的站内信信息DTO信息</param>
        /// <returns>业务操作结果</returns>
        Task<OperationResult> UpdateMessages(params MessageInputDto[] dtos);
            
        /// <summary>
        /// 删除站内信信息信息
        /// </summary>
        /// <param name="ids">要删除的站内信信息编号</param>
        /// <returns>业务操作结果</returns>
        Task<OperationResult> DeleteMessages(params Guid[] ids);
        

        #endregion
        
        #region 站内信接收记录信息业务

        /// <summary>
        /// 获取 站内信接收记录信息查询数据集
        /// </summary>
        IQueryable<MessageReceive> MessageReceives { get; }

        /// <summary>
        /// 检查站内信接收记录信息信息是否存在
        /// </summary>
        /// <param name="predicate">检查谓语表达式</param>
        /// <param name="id">更新的站内信接收记录信息编号</param>
        /// <returns>站内信接收记录信息是否存在</returns>
        Task<bool> CheckMessageReceiveExists(Expression<Func<MessageReceive, bool>> predicate, Guid id = default(Guid));
        
        /// <summary>
        /// 添加站内信接收记录信息信息
        /// </summary>
        /// <param name="dtos">要添加的站内信接收记录信息DTO信息</param>
        /// <returns>业务操作结果</returns>
        Task<OperationResult> CreateMessageReceives(params MessageReceiveInputDto[] dtos);
            
        /// <summary>
        /// 更新站内信接收记录信息信息
        /// </summary>
        /// <param name="dtos">包含更新信息的站内信接收记录信息DTO信息</param>
        /// <returns>业务操作结果</returns>
        Task<OperationResult> UpdateMessageReceives(params MessageReceiveInputDto[] dtos);
            
        /// <summary>
        /// 删除站内信接收记录信息信息
        /// </summary>
        /// <param name="ids">要删除的站内信接收记录信息编号</param>
        /// <returns>业务操作结果</returns>
        Task<OperationResult> DeleteMessageReceives(params Guid[] ids);
        

        #endregion
        
        #region 站内信回复信息业务

        /// <summary>
        /// 获取 站内信回复信息查询数据集
        /// </summary>
        IQueryable<MessageReply> MessageReplies { get; }

        /// <summary>
        /// 检查站内信回复信息信息是否存在
        /// </summary>
        /// <param name="predicate">检查谓语表达式</param>
        /// <param name="id">更新的站内信回复信息编号</param>
        /// <returns>站内信回复信息是否存在</returns>
        Task<bool> CheckMessageReplyExists(Expression<Func<MessageReply, bool>> predicate, Guid id = default(Guid));
        
        /// <summary>
        /// 添加站内信回复信息信息
        /// </summary>
        /// <param name="dtos">要添加的站内信回复信息DTO信息</param>
        /// <returns>业务操作结果</returns>
        Task<OperationResult> CreateMessageReplies(params MessageReplyInputDto[] dtos);
            
        /// <summary>
        /// 更新站内信回复信息信息
        /// </summary>
        /// <param name="dtos">包含更新信息的站内信回复信息DTO信息</param>
        /// <returns>业务操作结果</returns>
        Task<OperationResult> UpdateMessageReplies(params MessageReplyInputDto[] dtos);
            
        /// <summary>
        /// 删除站内信回复信息信息
        /// </summary>
        /// <param name="ids">要删除的站内信回复信息编号</param>
        /// <returns>业务操作结果</returns>
        Task<OperationResult> DeleteMessageReplies(params Guid[] ids);
        

        #endregion
        
    }
}
