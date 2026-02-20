# BUILD STAGE
FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_SERVER_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_REDIRECT_URI
ARG VITE_FACEBOOK_APP_ID

# Set them as ENV so the Node build process sees them
ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_REDIRECT_URI=$VITE_GOOGLE_REDIRECT_URI
ENV VITE_FACEBOOK_APP_ID=$VITE_FACEBOOK_APP_ID

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build


# PRODUCTION STAGE
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]