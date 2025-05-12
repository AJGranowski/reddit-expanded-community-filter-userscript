# docker buildx imagetools inspect --format='{{json .Manifest.Digest}}' node:current-alpine
FROM node:24.0.1-alpine@sha256:37712740dc486f179b9540be1c6703cef3f805ea932573a007db748b71189afe

# Add Minisign for signing artifacts.
RUN apk add --no-cache minisign>0.11

COPY entrypoint /entrypoint
ARG GOSU_VERSION=1.17
ARG SETPRIV_VERSION=2.40.1
ARG UTIL_LINUX_VERSION=2.39.3
RUN chmod +x /entrypoint && /entrypoint --setup
ENTRYPOINT ["/entrypoint", "--", "npm"]