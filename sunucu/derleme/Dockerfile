# Build image for derle.sh: arc's glibc 2.28 is too old for Next's native SWC/Turbopack (needs 2.29).
# Built on arc with the host user's ids, so ssh and git see a real bozo-derleme user (install docs).
FROM node:24-bookworm-slim
ARG UID
ARG GID
RUN apt-get update \
  && apt-get install -y --no-install-recommends git openssh-client ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd -g "$GID" bozo-derleme \
  && useradd -u "$UID" -g "$GID" -d /var/lib/bozo-derleme -M -s /usr/sbin/nologin bozo-derleme
USER bozo-derleme
