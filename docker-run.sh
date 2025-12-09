#!/bin/bash

# Meta Master App - Docker Run Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Meta Master App - Docker Runner${NC}"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check for backend .env file
if [ ! -f "./backend/.env" ]; then
    echo -e "${YELLOW}Warning: backend/.env not found. Creating from example...${NC}"
    if [ -f "./backend/.env.example" ]; then
        cp ./backend/.env.example ./backend/.env
        echo -e "${YELLOW}Please edit backend/.env with your actual configuration.${NC}"
    else
        echo -e "${RED}Error: backend/.env.example not found.${NC}"
        exit 1
    fi
fi

# Parse command line arguments
case "${1:-up}" in
    up|start)
        echo -e "${GREEN}Starting services...${NC}"
        docker compose up -d --build
        echo ""
        echo -e "${GREEN}Services started successfully!${NC}"
        echo "  Frontend: http://localhost:3000"
        echo "  Backend:  http://localhost:5000"
        echo "  Health:   http://localhost:5000/health"
        ;;
    down|stop)
        echo -e "${YELLOW}Stopping services...${NC}"
        docker compose down
        echo -e "${GREEN}Services stopped.${NC}"
        ;;
    restart)
        echo -e "${YELLOW}Restarting services...${NC}"
        docker compose down
        docker compose up -d --build
        echo -e "${GREEN}Services restarted.${NC}"
        ;;
    logs)
        docker compose logs -f
        ;;
    logs-backend)
        docker compose logs -f backend
        ;;
    logs-frontend)
        docker compose logs -f frontend
        ;;
    status)
        docker compose ps
        ;;
    build)
        echo -e "${GREEN}Building images...${NC}"
        docker compose build
        ;;
    clean)
        echo -e "${YELLOW}Cleaning up Docker resources...${NC}"
        docker compose down -v --rmi local
        echo -e "${GREEN}Cleanup complete.${NC}"
        ;;
    *)
        echo "Usage: $0 {up|down|restart|logs|logs-backend|logs-frontend|status|build|clean}"
        echo ""
        echo "Commands:"
        echo "  up, start     - Build and start all services"
        echo "  down, stop    - Stop all services"
        echo "  restart       - Restart all services"
        echo "  logs          - Follow logs from all services"
        echo "  logs-backend  - Follow backend logs only"
        echo "  logs-frontend - Follow frontend logs only"
        echo "  status        - Show service status"
        echo "  build         - Build images without starting"
        echo "  clean         - Stop services and remove images/volumes"
        exit 1
        ;;
esac
