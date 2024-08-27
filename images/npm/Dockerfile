# docker buildx imagetools inspect --format='{{json .Manifest.Digest}}' node:current-alpine
FROM node:22.7.0-alpine@sha256:ed9736a13b88ba55cbc08c75c9edac8ae7f72840482e40324670b299336680c1

# Add Minisign for signing artifacts.
RUN apk add --no-cache minisign>0.11

# Fix permissions issues when using a non-root user.
ARG USER_ID
ARG USER_NAME
ARG USER_GROUP_ID
ARG USER_GROUP_NAME
RUN if [ -n "${USER_GROUP_NAME}" -a -n "${USER_NAME}" -a "${USER_NAME}" != "root" ] && if [ -n "${USER_ID}" ]; then [ ${USER_ID} -ne 0 ]; fi; then \
        echo "Remove user" && \
        if getent passwd "${USER_NAME}" 1>/dev/null 2>&1; then \
            echo "    $(getent passwd ${USER_NAME})" && \
            deluser "${USER_NAME}" \
        ;fi && \
        if [ -n "${USER_ID}" ] && getent passwd "${USER_ID}" 1>/dev/null 2>&1; then \
            echo "    $(getent passwd ${USER_ID})" && \
            deluser "$(getent passwd "${USER_ID}" | cut -d':' -f1)" \
        ;fi && \
        echo "Remove group" && \
        if getent group "${USER_GROUP_NAME}" 1>/dev/null 2>&1; then \
            echo "    $(getent group ${USER_GROUP_NAME})" && \
            delgroup "${USER_GROUP_NAME}" || true \
        ;fi && \
        if [ -n "${USER_GROUP_ID}" ] && getent group "${USER_GROUP_ID}" 1>/dev/null 2>&1; then \
            echo "    $(getent group ${USER_GROUP_ID})" && \
            delgroup "$(getent group "${USER_GROUP_ID}" | cut -d':' -f1)" || true \
        ;fi && \
        echo "Add group" && \
        if [ -n "${USER_GROUP_ID}" ]; then \
            addgroup -g "${USER_GROUP_ID}" "${USER_GROUP_NAME}" || true \
        ;else \
            addgroup "${USER_GROUP_NAME}" || true \
        ;fi && \
        echo "    $(getent group ${USER_GROUP_NAME})" && \
        echo "Add user" && \
        if [ -n "${USER_ID}" ]; then \
            adduser -u "${USER_ID}" -s /bin/sh -G "${USER_GROUP_NAME}" -DH "${USER_NAME}" \
        ;else \
            adduser -s /bin/sh -G "${USER_GROUP_NAME}" -DH "${USER_NAME}" \
        ;fi && \
        echo "    $(getent passwd ${USER_NAME})" \
    ;fi

# Create directories and files, and set the ownership of a list of items to the added user.
ARG CHOWN_LIST
ARG MKDIR_LIST
ARG TOUCH_LIST
RUN if [ -n "${MKDIR_LIST}" ]; then \
        eval mkdir --parents --verbose ${MKDIR_LIST} \
    ;fi && \
    if [ -n "${TOUCH_LIST}" ]; then \
        eval touch ${TOUCH_LIST} \
    ;fi && \
    if [ -n "${USER_NAME}" ] && [ -n "${CHOWN_LIST}" ]; then \
        echo "Change ownership" && \
        eval chown -c "$(getent passwd ${USER_NAME} | cut -d':' -f3):$(getent passwd ${USER_NAME} | cut -d':' -f4)" ${CHOWN_LIST} \
    ;fi

USER ${USER_NAME:-root}