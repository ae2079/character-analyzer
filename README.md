# Character Sequence Analyzer

A React application that analyzes text files to find repeated character sequences and uses OpenAI to sort the results.

## Features

- File upload via drag & drop or file picker
- Character sequence analysis
- AI-powered sorting of results using OpenAI
- History of last 5 processed files
- Results persistence using local storage
- Docker containerization for easy deployment

## Prerequisites

- Node.js 20.x or later
- npm or yarn
- Docker (for containerized deployment)
- OpenAI API key

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file and add your OpenAI API key:
```
REACT_APP_OPENAI_API_KEY=your_api_key_here
```

3. Start the development server:
```bash
npm start
```

## Building and Running with Docker

1. Build the Docker image:
```bash
docker build -t character-analyzer .
```

2. Run the container:
```bash
docker run -p 80:80 character-analyzer
```

## Deployment

### Using Docker Compose

1. Update the `docker-compose.yml` file with your configuration
2. Run:
```bash
docker-compose up -d
```

### Manual Deployment on Ubuntu Server

1. Install Docker and Docker Compose
2. Clone this repository
3. Configure environment variables
4. Run with Docker Compose

For detailed deployment instructions, see the [Deployment Guide](DEPLOYMENT.md).

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/utils` - Utility functions
- `/public` - Static files
- `Dockerfile` - Docker configuration
- `docker-compose.yml` - Docker Compose configuration
- `nginx.conf` - Nginx server configuration

## Environment Variables

- `REACT_APP_OPENAI_API_KEY` - Your OpenAI API key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes. 