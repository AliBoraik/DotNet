FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS build
WORKDIR /source
COPY ["UI.csproj", "UI/"]
COPY . .
RUN dotnet restore "UI.csproj" --disable-parallel
RUN dotnet publish "UI.csproj" -c releas -o /app --no-restore


FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app ./ 

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["dotnet", "UI.dll"]