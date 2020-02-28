from flask import Flask, request, send_from_directory
from flask_cors import CORS
from hydra_agent.agent import Agent
import sys
import json, os
from requests import get

from lib.utils import serve, start_agent, hydra_doc, apidoc_graph, send_command, default



app = Flask(__name__, static_folder='console-frontend/build/')

# Setting CORS so it allows requests from our React app in localhost:3000
CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})

# Remove to deploy
url = "http://localhost:8080/serverapi"
agent = Agent(url)

app.add_url_rule('/<path:path>', 'serve', serve)
app.add_url_rule('/start-agent', 'start-agent', start_agent)
app.add_url_rule('/hydra-doc', 'hydra-doc', hydra_doc)
app.add_url_rule('/apidoc-graph', 'apidoc-graph', apidoc_graph)
app.add_url_rule('/send-command', 'send-command', send_command)
app.add_url_rule('/','default', default)


if __name__ == '__main__':
    app.run(use_reloader=True, port=3000, threaded=True)