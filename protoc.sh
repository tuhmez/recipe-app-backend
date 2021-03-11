# Path to files
PROTO_FILE_PATH="./src/proto"
# Path to TS plugin
PROTOC_GEN_TS_PATH="$PWD/node_modules/.bin/protoc-gen-ts"
# Path to gRPC plugin, which generate service typings
GRPC_TOOLS_NODE_PROTOC_PLUGIN="$PWD/node_modules/.bin/grpc_tools_node_protoc_plugin"
# Path to gRPC proto command
GRPC_TOOLS_NODE_PROTOC="$PWD/node_modules/.bin/grpc_tools_node_protoc"
if [[ "$OSTYPE" == "msys" ]]; then
    PROTOC_GEN_TS_PATH="${PROTOC_GEN_TS_PATH}.cmd"
    GRPC_TOOLS_NODE_PROTOC_PLUGIN="${GRPC_TOOLS_NODE_PROTOC_PLUGIN}.cmd"
    GRPC_TOOLS_NODE_PROTOC="${GRPC_TOOLS_NODE_PROTOC}.cmd"
fi

for f in $PROTO_FILE_PATH/*.proto; do
    ${GRPC_TOOLS_NODE_PROTOC} \
        --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
        --js_out="import_style=commonjs,binary:${PROTO_FILE_PATH}" \
        --ts_out="grpc_js:${PROTO_FILE_PATH}" \
        --grpc_out="grpc_js:${PROTO_FILE_PATH}" \
        -I "${PROTO_FILE_PATH}" \
        "${f}"
done
