namespace Chat.Interfaces;

public interface IChatService
{
    Task<Domain.Entities.Chat?> GetChat(Guid chatId);
    Task<Guid> AddChat(Guid userId);
    Task<bool> JoinAdmin(Guid chatId, Guid adminId);
    Task RemoveAdmin(Guid chatId);
    Task<List<Domain.Entities.Chat>> GetAll();
    Task<List<Domain.Entities.Chat>> GetFree();
}