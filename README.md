# Blueprint Analysis Platform
An AI-powered bid estimation platform for construction and painting contractors.

## Overview
This platform uses AI to analyze construction documents and automatically generate accurate bid estimates. It streamlines the estimation process by extracting room details, paint specifications, and surface areas to create detailed cost breakdowns.

## Tech Stack
- MongoDB: Database
- Express.js: Backend framework
- React.js: Frontend framework
- Node.js: Runtime environment
- OpenAI API: Document analysis
- AWS S3: Document storage

## Prerequisites
- Node.js 18.x or higher
- MongoDB 6.x or higher
- npm or yarn package manager
- AWS account (for S3)
- OpenAI API key

## Getting Started
1. Clone the repository
```bash
git clone https://github.com/[your-username]/blueprint-analysis.git
cd blueprint-analysis
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
Create `.env` files in both backend and frontend directories:

Backend `.env`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blueprint-analysis
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
OPENAI_API_KEY=your_openai_key
```

Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5000
```

4. Start development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm start
```

## Project Structure
```
blueprint-analysis/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── config/
│   │   └── utils/
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── assets/
│   ├── public/
│   └── package.json
└── README.md
```

## Development Guidelines
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Write unit tests for all new features
- Use meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- Create feature branches from `develop` branch
- Submit pull requests for code review

## Available Scripts
Backend:
```bash
npm run dev      # Start development server
npm run test     # Run tests
npm run lint     # Run linter
npm run build    # Build for production
```

Frontend:
```bash
npm start        # Start development server
npm test         # Run tests
npm run build    # Build for production
npm run eject    # Eject from Create React App
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.