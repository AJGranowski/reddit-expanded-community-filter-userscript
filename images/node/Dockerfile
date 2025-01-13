# docker buildx imagetools inspect --format='{{json .Manifest.Digest}}' node:current-alpine
FROM node:23.6.0-alpine@sha256:498bf3e45a4132b99952f88129ae5429e3568f3836edbfc09e3661515f620837

# Add Minisign for signing artifacts.
RUN apk add --no-cache minisign>0.11

COPY entrypoint /entrypoint
ARG GOSU_VERSION=1.17
ARG SETPRIV_VERSION=2.40.1
ARG UTIL_LINUX_VERSION=2.39.3
RUN chmod +x /entrypoint && /entrypoint --setup
ENTRYPOINT ["/entrypoint", "--"]