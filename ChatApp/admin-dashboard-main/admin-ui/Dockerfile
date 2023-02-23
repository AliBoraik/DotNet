FROM node:16-alpine 
WORKDIR /app
COPY . .
RUN npm install  
RUN npm run build
ENV NODE_ENV production
EXPOSE 2000
CMD [ "npm", "start"]