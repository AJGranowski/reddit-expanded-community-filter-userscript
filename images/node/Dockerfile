# docker buildx imagetools inspect --format='{{json .Manifest.Digest}}' node:current-alpine
FROM node:23.6.1-alpine@sha256:15b885c5e195296ba49bab32681b478e92eb0f255078a84ad29020b87b0bdcc6

# Add Minisign for signing artifacts.
RUN apk add --no-cache minisign>0.11

COPY entrypoint /entrypoint
ARG GOSU_VERSION=1.17
ARG SETPRIV_VERSION=2.40.1
ARG UTIL_LINUX_VERSION=2.39.3
RUN chmod +x /entrypoint && /entrypoint --setup
ENTRYPOINT ["/entrypoint", "--"]