using Chat.Api.Hubs;
using Chat.Api.Producer;
using Chat.Application;
using Chat.Infrastructure;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddSignalR();
builder.Services.AddSingleton<MessageHub>();
builder.Services.AddScoped<IRabbitMqProducer, RabbitMqProducer>();

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();

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

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection(); 
app.UseCors("ClientPermission");

app.UseAuthorization();

app.MapHub<MessageHub>("/message");
app.MapControllers();
var services = app.Services.CreateScope().ServiceProvider;
//services.GetRequiredService<MessageDataContext>().Database.Migrate();

app.Run();