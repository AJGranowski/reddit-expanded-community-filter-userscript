# docker buildx imagetools inspect --format='{{json .Manifest.Digest}}' node:current-alpine
FROM node:22.2.0-alpine@sha256:9e8f45fc08c709b1fd87baeeed487977f57585f85f3838c01747602cd85a64bb

ARG CHOWN_LIST
ARG MKDIR_LIST
ARG TOUCH_LIST
ARG USER_ID
ARG USER_NAME
ARG USER_GROUP_ID
ARG USER_GROUP_NAME

# Add Minisign for signing artifacts.
RUN apk add --no-cache minisign>0.11

# Create directories and files.
RUN if [ -n "${MKDIR_LIST}" ]; then \
        eval mkdir --parents --verbose ${MKDIR_LIST} \
    ;fi && \
    if [ -n "${TOUCH_LIST}" ]; then \
        eval touch ${TOUCH_LIST} \
    ;fi

# Fix permissions issues on mounted items when using a non-root user.
RUN if [ -n "${USER_NAME}" ] && [ "${USER_NAME}" != "root" ] && if [ -n "${USER_ID}" ]; then [ ${USER_ID} -ne 0 ]; fi; then \
        echo "Remove user" && \
        if getent passwd "${USER_NAME}"; then \
            deluser "${USER_NAME}" \
        ;fi && \
        if [ -n "${USER_ID}" ] && getent passwd "${USER_ID}"; then \
            deluser "$(getent passwd "${USER_ID}" | cut -d':' -f1)" \
        ;fi && \
        echo "Remove group" && \
        if getent group "${USER_GROUP_NAME}"; then \
            delgroup "${USER_GROUP_NAME}" || true \
        ;fi && \
        if [ -n "${USER_GROUP_ID}" ] && getent group "${USER_GROUP_ID}"; then \
            delgroup "$(getent group "${USER_GROUP_ID}" | cut -d':' -f1)" || true \
        ;fi && \
        echo "Add user" && \
        if [ -n "${USER_ID}" ]; then \
            adduser -u "${USER_ID}" -s /bin/sh -D "${USER_NAME}" \
        ;else \
            adduser -s /bin/sh -D "${USER_NAME}" \
        ;fi && \
        echo "Add group" && \
        if [ -n "${USER_GROUP_ID}" ]; then \
            addgroup -g "${USER_GROUP_ID}" "${USER_NAME}" "${USER_GROUP_NAME}" || true \
        ;else \
            addgroup "${USER_NAME}" "${USER_GROUP_NAME}" || true \
        ;fi && \
        echo "Change ownership" && \
        if [ -n "${CHOWN_LIST}" ]; then \
            eval chown -c "${USER_ID}:${USER_GROUP_ID}" ${CHOWN_LIST} \
        ;fi \
    ;fi

USER ${USER_NAME:-root}