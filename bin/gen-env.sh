#!/usr/bin/env bash
# regenerate .env from ports.yaml (exposed ports only)

# requires yq (https://github.com/mikefarah/yq)
yq eval '.[] | select(.expose == true) | "\(.name | upcase)_PORT=\(.port)"' ports.yaml > .env
echo ".env regenerated from ports.yaml"
