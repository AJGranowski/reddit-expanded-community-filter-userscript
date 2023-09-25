FROM node:20.7.0-alpine

ARG USER_ID
ARG USER_NAME
ARG USER_OWNED_PATHS

# Create $USER_NAME and give them ownership of $USER_OWNED_PATHS
RUN if [ -n "${USER_NAME}" ] && [ "${USER_NAME}" != "root" ] && if [ -n "${USER_ID}" ]; then [ ${USER_ID} -ne 0 ]; fi; then \
        if getent passwd "${USER_NAME}"; then \
            deluser "${USER_NAME}" \
        ;fi && \
        if [ -n "${USER_ID}" ] && getent passwd "${USER_ID}"; then \
            deluser "$(getent passwd "${USER_ID}" | cut -d':' -f1)" \
        ;fi && \
        addgroup 127 && \
        if [ -n "${USER_ID}" ]; then \
            adduser -G 127 -u "${USER_ID}" -s /bin/sh -D "${USER_NAME}" \
        ;else \
            adduser -G 127 -s /bin/sh -D "${USER_NAME}" \
        ;fi && \
        id "${USER_NAME}" && \
        if [ -n "${USER_OWNED_PATHS}" ]; then \
            eval mkdir -p ${USER_OWNED_PATHS} && \
            eval chown -Rc "${USER_NAME}" ${USER_OWNED_PATHS} && \
            eval ls -la /app ${USER_OWNED_PATHS} \
        ;fi \
    ;fi

USER ${USER_NAME}