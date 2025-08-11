# House Booking App

A modern React Native application that allows users to list and book houses, similar to Airbnb. Users can upload house images after payment, and guests can book houses through a calendar-based system.

## Features

### 🏠 Core Functionality
- **User Authentication**: Secure sign-up and sign-in system
- **House Listings**: Users can upload and manage house listings
- **Image Management**: Support for multiple house images (up to 8 per listing)
- **Search & Discovery**: Browse available properties

### 📅 Booking System
- **Calendar Interface**: Interactive calendar for date selection
- **Availability Management**: Real-time availability checking
- **Booking Requests**: Users can request bookings with custom messages
- **Status Tracking**: Pending, confirmed, and rejected booking states

### 💳 Payment System
- **Image Upload Fee**: $9.99 one-time payment to list properties
- **Multiple Payment Methods**: Credit card, PayPal, Apple Pay support
- **Secure Transactions**: Encrypted payment processing
- **Payment History**: Track all payment transactions

### 👨‍💼 Host Dashboard
- **Property Management**: View and manage all listed properties
- **Booking Overview**: See all incoming booking requests
- **Statistics**: Track total properties, bookings, and revenue
- **Quick Actions**: Confirm or reject bookings with one tap

### 🎨 Modern UI/UX
- **Gradient Headers**: Beautiful gradient backgrounds
- **Card-based Design**: Clean, modern card layouts
- **Responsive Layout**: Optimized for all screen sizes
- **Haptic Feedback**: Enhanced user experience with vibrations
- **Loading States**: Smooth loading animations and progress bars

## Technical Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Navigation**: Screen navigation and routing

### Backend & Database
- **Supabase**: Backend-as-a-Service platform
- **PostgreSQL**: Relational database
- **Row Level Security**: Secure data access policies

### Key Libraries
- `react-native-calendars`: Calendar functionality
- `expo-linear-gradient`: Gradient backgrounds
- `expo-haptics`: Haptic feedback
- `expo-image-picker`: Image selection and upload

## Database Schema

### Tables
1. **houses**: Property listings with images and details
2. **bookings**: Guest booking requests and confirmations
3. **upload_payments**: Payment records for image uploads
4. **user_profiles**: Extended user information

### Key Relationships
- Users can have multiple houses
- Houses can have multiple bookings
- Payments are linked to specific house uploads
- Bookings reference both users and houses

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator

### Setup Steps
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BookingApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a Supabase project
   - Update `src/utils/supabaseClient.js` with your credentials
   - Run the database schema from `database_schema.sql`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   npm run ios     # iOS
   npm run android # Android
   ```

## Usage Guide

### For House Owners (Hosts)
1. **Sign up/Login**: Create an account or sign in
2. **Payment**: Pay $9.99 to upload house images
3. **Add Property**: Fill in details and upload images
4. **Manage Bookings**: Review and respond to booking requests
5. **Dashboard**: Monitor your properties and bookings

### For Guests
1. **Browse Properties**: View available houses
2. **Select Dates**: Use the calendar to choose stay dates
3. **Request Booking**: Send booking request with contact info
4. **Wait for Confirmation**: Host will confirm or reject
5. **Contact Host**: Direct communication for final arrangements

## Business Model

### Revenue Streams
- **Image Upload Fees**: $9.99 per property listing
- **No Commission**: Hosts keep 100% of booking revenue
- **Scalable**: Revenue grows with user base

### User Benefits
- **Hosts**: Monetize unused properties
- **Guests**: Find affordable accommodations
- **Platform**: Sustainable revenue model

## Security Features

- **Row Level Security**: Database-level access control
- **User Authentication**: Secure Supabase Auth integration
- **Payment Encryption**: Secure payment processing
- **Data Validation**: Input validation and sanitization

## Performance Optimizations

- **Image Compression**: Optimized image uploads
- **Lazy Loading**: Efficient data fetching
- **Caching**: Local data caching for better performance
- **Indexing**: Database indexes for fast queries

## Future Enhancements

### Planned Features
- **Real-time Chat**: Direct messaging between hosts and guests
- **Reviews & Ratings**: User feedback system
- **Advanced Search**: Filters for location, price, amenities
- **Push Notifications**: Booking updates and reminders
- **Analytics Dashboard**: Detailed performance metrics

### Technical Improvements
- **Offline Support**: Work without internet connection
- **Image CDN**: Faster image loading
- **API Rate Limiting**: Prevent abuse
- **Multi-language Support**: Internationalization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Acknowledgments

- Supabase team for the excellent backend platform
- React Native community for the amazing ecosystem
- Expo team for the development tools
- All contributors and beta testers

---

**Built with ❤️ using React Native and Supabase**
