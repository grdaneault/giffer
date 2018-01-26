from apps import prepare_flask_app

application = prepare_flask_app()

if __name__ == '__main__':
    application.run(host="0.0.0.0", port=5000)
