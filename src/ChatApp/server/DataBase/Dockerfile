FROM postgres:latest
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD admin
ENV POSTGRES_DB messagedb
COPY SQL/* /docker-entrypoint-initdb.d/