# Character Sequence Analyzer

A React application that analyzes text files to find repeated character sequences and uses OpenAI to sort the results.

## Features

- File upload via drag & drop or file picker
- Character sequence analysis
- AI-powered sorting of results using OpenAI
- History of last 5 processed files
- Results persistence using local storage

## Prerequisites

- Node.js 20.x or later
- npm or yarn
- Docker and Docker Compose (for containerized deployment)
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

## Docker Deployment

1. Clone the repository:
```bash
git clone https://github.com/your-username/character-analyzer.git
cd character-analyzer
```

2. Create a `.env` file with your OpenAI API key:
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

3. Start the application with Docker Compose:
```bash
docker-compose up -d
```

The application will be available at http://localhost:3000

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/utils` - Utility functions
- `/public` - Static files
- `Dockerfile` - Docker configuration
- `docker-compose.yml` - Docker Compose configuration

## Environment Variables

- `REACT_APP_OPENAI_API_KEY` - Your OpenAI API key
- `NODE_ENV` - Application environment (development/production)
- `PORT` - Application port (default: 3000)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes. 