FROM node:14-alpine
WORKDIR /core
ENV PATH /app/node_modules/.bin:$PATH
COPY . .
RUN npm install
RUN npm build
CMD ["npm", "start"]
