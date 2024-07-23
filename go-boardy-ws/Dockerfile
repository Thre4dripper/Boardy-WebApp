# Stage 1: Build the Go application
# Use the official Golang image as the build environment
FROM golang:1.23-rc AS builder

# Set the working directory inside the container
WORKDIR /go/src/app

# Copy the entire project directory into the container
COPY . .

# Build the Go application with static linking to ensure compatibility with minimal Linux images
RUN CGO_ENABLED=0 go build -ldflags '-extldflags "-static"' -o main .

# Stage 2: Create the final container image
# Use the latest BusyBox image, a minimal Linux distribution
FROM scratch

# Set the working directory inside the container
WORKDIR /root/

# Copy the statically linked binary from the build stage to the final container
COPY --from=builder /go/src/app/main .

# Expose port 8080 to allow external access to the application
EXPOSE 8080

# Specify the command to run the application
CMD ["./main"]
