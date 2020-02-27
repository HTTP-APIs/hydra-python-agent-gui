from flask import Flask, request, send_from_directory
from flask_cors import CORS
from hydra_agent.agent import Agent
import sys
import json, os
from requests import get

from lib.func import serve, start_agent, hydra_doc, apidoc_graph, send_command, default



app = Flask(__name__, static_folder='console-frontend/build/')

# Setting CORS so it allows requests from our React app in localhost:3000
CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})

# Remove to deploy
url = "http://localhost:8080/serverapi"
agent = Agent(url)

app.add_url_rule('/<path:path>','serve',serve)
app.add_url_rule('/start-agent','start-agent', start_agent)
app.add_url_rule('/hydra-doc','hydra-doc', hydra_doc)
app.add_url_rule('/apidoc-graph','apidoc-graph', apidoc_graph)
app.add_url_rule('/send-command','send-command', send_command)
app.add_url_rule('/','default',default)


# @app.route('/', defaults={'path': ''})



# @app.route('/<path:path>')
# def serve(path):
#     """Default endpoint, it serves the built static React App
#     :return: Served file
#     """
#     if path != "" and os.path.exists(app.static_folder + path):
#         return send_from_directory(app.static_folder, path)
#     else:
#         return send_from_directory(app.static_folder, 'index.html')

# @app.route("/start-agent", methods=['POST'])
# def start_agent():
#     """Receive hydrus server URL and start the Agent
#     :param body['url']: Entrypoint URL for the hydrus server
#     :return: Success message
#     """
#     global agent
#     global  url
#     body = request.get_data()
#     body = body.decode('utf8').replace("'", '"')
#     body = json.loads(body)
#     url = body['url']
#     agent = Agent(url)
#     return "Server started successfully"

# @app.route("/hydra-doc", methods=['GET'])
# def hydra_doc():
#     """Serve Hydra Doc
#     :return: Hydra Doc loaded on the agent with url for current connected 
#     """
#     apidoc = agent.fetch_apidoc()
#     generatedApiDoc = apidoc.generate()
#     generatedApiDoc['serverURL'] = url
#     return generatedApiDoc
 
# @app.route("/apidoc-graph", methods=['GET'])
# def apidoc_graph():
#     """Sends Formatted ApiDoc Graph in Vis.js network format to Frontend
#     :return: Dict containing Nodes and Edges
#     """
#     global agent
#     if agent is None:
#         return "No agent connected."
#     # Add the entrypoint node
#     nodes = [{"id": 1, "shape": 'hexagon', "size": 15, "label": 'Entrypoint'}]
#     edges = list()
#     id = 1
#     api_doc = agent.fetch_apidoc()
#     for resource_endpoint in api_doc.entrypoint.entrypoint.supportedProperty:
#         id+=1
#         endpoint_id = id
#         endpoint_path = resource_endpoint.id_.replace("vocab:EntryPoint/", "")
#         endpoint_node = create_node(endpoint_id, "box", 12, endpoint_path)
#         nodes.append(endpoint_node)
#         edge = create_edge(1, endpoint_id)
#         edges.append(edge)
#         for supportedOp in resource_endpoint.supportedOperation:
#             id+=1
#             op_id = id
#             operation_node = create_node(op_id, "circle", 10, supportedOp.method)
#             nodes.append(operation_node)
#             supportedOp_edge = create_edge(endpoint_id, op_id, "supportedOp")
#             edges.append(supportedOp_edge)
#             if supportedOp.expects:
#                 expects = supportedOp.expects
#             else:
#                 expects = "null"
#             if supportedOp.returns:
#                 returns = supportedOp.returns
#             else:
#                 returns = "null"
#             # Extract class name
#             if "vocab:" in expects:
#                 expects = expects.replace("vocab:", "")
#             if "vocab:" in returns:
#                 returns = returns.replace("vocab:", "")
#             id += 1
#             expected_class_node = create_node(id, "circle", 8, expects)
#             nodes.append(expected_class_node)
#             expects_edge = create_edge(op_id, id, "expects")
#             edges.append(expects_edge)
#             if expects in api_doc.parsed_classes:
#                 class_id = id
#                 for supportedProp in api_doc.parsed_classes[expects]['class'].supportedProperty:
#                     id+=1
#                     property_node = create_node(id, "box", 7, supportedProp.title)
#                     nodes.append(property_node)
#                     property_edge = create_edge(class_id, id, "supportedProp")
#                     edges.append(property_edge)
#             id += 1
#             returned_class_node = create_node(id, "circle", 8, returns)
#             nodes.append(returned_class_node)
#             returns_edge = create_edge(op_id, id, "returns")
#             edges.append(returns_edge)
#             if returns in api_doc.parsed_classes:
#                 class_id = id
#                 for supportedProp in api_doc.parsed_classes[returns]['class'].supportedProperty:
#                     id+=1
#                     property_node = create_node(id, "box", 7, supportedProp.title)
#                     nodes.append(property_node)
#                     property_edge = create_edge(class_id, id, "supportedProp")
#                     edges.append(property_edge)
#     graph = {
#         "nodes": nodes,
#         "edges": edges
#     }
#     return graph


# def create_node(id, shape, size, label):
#     """Auxiliary function that creates a Node in Vis.js format
#     :return: Dict with Node attributes
#     """
#     node = {
#         "id": id,
#         "shape": shape,
#         "size": size,
#         "label": label
#     }
#     return node


# def create_edge(from_, to, label=None):
#     """Auxiliary function that creates a Edge in Vis.js format
#     :return: Dict with Edge attributes
#     """
#     edge = {
#         "from": from_,
#         "to": to
#     }
#     if label is not None:
#         edge["label"] = label
#     return edge

# @app.route("/send-command", methods=['POST'])
# def send_command():
#     """Send Command to Agent and returns hydrus response
#     :param: All parameters enabled by the Agent.
#     :param: Please check Agent.py in Agent's main repository.
#     :return: hydrus response to the request
#     """
#     global agent
#     if agent is None:
#         return "No agent connected."
#     body = request.get_data()
#     body = body.decode('utf8')
#     body = json.loads(body)
#     if "method" not in body:
#         return "Request must have a method."
#     if body['method'] == "get":
#         # Get optional parameters
#         filters = body.get('filters', {})
#         cached_limit = body.get('cached_limit', sys.maxsize)
#         if 'url' in body:
#             return json.dumps(agent.get(url=body['url'], filters=filters,
#                               cached_limit=cached_limit))
#         elif 'resource_type' in body:
#             return json.dumps(agent.get(resource_type=body['resource_type'],
#                               filters=filters, cached_limit=cached_limit))
#         else:
#             return "Must contain url or the resource type"
#     elif body['method'] == "put":
#         if "url" in body:
#             url = body['url']
#         else:
#             return "Put request must contain a url"
#         if "new_object" in body:
#             new_object = body["new_object"]
#         else:
#             return "Put request must contain the new_object."
#         return json.dumps(agent.put(url, new_object))
#     elif body['method'] == "post":
#         if "url" in body:
#             url = body['url']
#         else:
#             return "Post request must contain a url"
#         if "updated_object" in body:
#             updated_object = body["updated_object"]
#         else:
#             return "Put request must contain the updated_object."
#         return json.dumps(agent.post(url, updated_object))
#     elif body['method'] == "delete":
#         if "url" in body:
#             url = body['url']
#         else:
#             return "Delete request must contain a url"
#         return json.dumps(agent.delete(url))
#     else:
#         return "Method not supported."


if __name__ == '__main__':
    app.run(use_reloader=True, port=3000, threaded=True)