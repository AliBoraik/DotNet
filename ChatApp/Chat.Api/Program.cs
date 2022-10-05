using Chat.Api.Database;
using Chat.Api.Hubs;
using Chat.Api.Repository;
using Chat.Api.Services;
using MassTransit;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// TODO database
/*builder.Services.AddEntityFrameworkNpgsql().AddDbContext<MessageDataContext>(options => options.UseNpgsql(
        builder.Configuration.GetConnectionString("MessageDb")
    )
);*/
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientPermission", policy =>
    {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:3000")
            .AllowCredentials();
    });
});
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<MessageCreatedConsumer>();
    x.UsingInMemory((context, cfg) =>
    {
        cfg.ConfigureEndpoints(context);
    });
});
builder.Services.AddSingleton<MessageHub>();

builder.Services.AddDbContext<MessageDataContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("MessageDb"));
});
builder.Services.AddScoped<IMessageRepository,MessageRepository>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("ClientPermission");

app.UseAuthorization();

app.MapHub<MessageHub>("/message");
app.MapControllers();

app.Run();