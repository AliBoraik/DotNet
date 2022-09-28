using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
namespace Lab_3.Hubs
{
    public class MessageHub : Hub
    {
        public async Task SendMassage(string message)
        {
        }
    }
}