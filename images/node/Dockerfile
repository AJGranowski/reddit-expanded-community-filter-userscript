# docker buildx imagetools inspect --format='{{json .Manifest.Digest}}' node:current-alpine
FROM node:23.2.0-alpine@sha256:ecefaffd4706c5879af52e022fdb8ea30cbd6590e2a30d05347790d690727c6c

# Add Minisign for signing artifacts.
RUN apk add --no-cache minisign>0.11

COPY entrypoint /entrypoint
ARG GOSU_VERSION=1.17
ARG SETPRIV_VERSION=2.40.1
ARG UTIL_LINUX_VERSION=2.39.3
RUN chmod +x /entrypoint && /entrypoint --setup
ENTRYPOINT ["/entrypoint", "--"]