# Node 16 base image
FROM node:16-alpine 
WORKDIR /app
COPY . .
RUN yarn install  
# Build the app
RUN yarn run build
ENV NODE_ENV production
EXPOSE 2000
CMD [ "yarn", "start"]