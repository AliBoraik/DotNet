FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS build
WORKDIR /source
COPY ["DB.csproj", "DB/"]
COPY . .
RUN dotnet restore "DB.csproj" --disable-parallel
RUN dotnet publish "DB.csproj" -c releas -o /app --no-restore


FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app ./ 

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["dotnet", "DB.dll"]