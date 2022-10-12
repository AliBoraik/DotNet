FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS build
WORKDIR /source
COPY ["Chat.Api/Chat.Api.csproj", "Chat.Api/"]
COPY ["Chat.Infrastructure/Chat.Infrastructure.csproj", "Chat.Infrastructure/"]
COPY ["Chat.Domain/Chat.Domain.csproj", "Chat.Domain/"]
COPY ["Chat.Application/Chat.Application.csproj", "Chat.Application/"]
COPY . .
RUN dotnet restore "./Chat.Api/Chat.Api.csproj" --disable-parallel
RUN dotnet publish "./Chat.Api/Chat.Api.csproj" -c releas -o /app --no-restore


FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app ./ 

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["dotnet", "Chat.Api.dll"]