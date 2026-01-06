# Cargo Tracker - Truck Fleet Management App

A complete React Native + Expo mobile application for managing truck fleets with real-time location tracking, trip management, and fuel stop monitoring. Built with Supabase backend, gluestack-ui for beautiful components, and React Navigation.

## Features

- **User Authentication**: Secure login with Supabase
- **Manager Dashboard**: Real-time summary of trucks, trips, weight, and fuel metrics
- **Trip Management**: Create, track, and manage deliveries
- **Fuel Stop Tracking**: Log fuel refills during trips
- **Unload Entry**: Mark trips as complete with automatic travel time calculation
- **Trips List**: Day-wise filtering and detailed trip information
- **Live Location Tracking**: Real-time truck positions on an interactive map
- **Responsive Design**: Beautiful UI using gluestack-ui components

## Tech Stack

- **Frontend**: React Native + Expo
- **UI Components**: gluestack-ui (Tailwind-based)
- **Navigation**: React Navigation (Stack Navigator)
- **Backend**: Supabase (Postgres + Real-time)
- **Location**: Expo Location + react-native-maps
- **Styling**: NativeWind (Tailwind CSS for React Native)

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account (free tier)
- Expo Go app (for testing on mobile)

## Installation

1. **Clone or extract the project**
   ```bash
   cd CargoTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   If you encounter issues:
   ```bash
   npm install --force
   ```

3. **Set up Supabase**
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key from Settings > API
   - Update `supabase.ts`:
     ```typescript
     const SUPABASE_URL = 'your-project-url';
     const SUPABASE_ANON_KEY = 'your-anon-key';
     ```

4. **Create Database Tables in Supabase**
   
   Execute the following SQL in Supabase SQL Editor:

   ```sql
   -- Trucks table
   CREATE TABLE trucks (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     truck_no TEXT UNIQUE NOT NULL,
     bid_number TEXT,
     created_at TIMESTAMP DEFAULT now()
   );

   -- Trips table
   CREATE TABLE trips (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     truck_id UUID REFERENCES trucks(id),
     bid_number TEXT,
     quantity_tons NUMERIC,
     chemical_type TEXT,
     depart_time TIMESTAMP,
     arrival_time TIMESTAMP,
     from_plant TEXT,
     to_plant TEXT,
     travel_time_minutes NUMERIC,
     unloaded BOOLEAN DEFAULT false,
     unloaded_time TIMESTAMP,
     created_at TIMESTAMP DEFAULT now()
   );

   -- Fuel stops table
   CREATE TABLE fuel_stops (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     trip_id UUID REFERENCES trips(id),
     stop_time TIMESTAMP,
     fuel_refilled_liters NUMERIC,
     location TEXT,
     created_at TIMESTAMP DEFAULT now()
   );

   -- Live locations table (enable Realtime!)
   CREATE TABLE live_locations (
     truck_id UUID PRIMARY KEY REFERENCES trucks(id),
     latitude NUMERIC NOT NULL,
     longitude NUMERIC NOT NULL,
     updated_at TIMESTAMP DEFAULT now()
   );

   -- Enable Realtime on live_locations
   ALTER TABLE live_locations ENABLE ROW LEVEL SECURITY;
   ALTER PUBLICATION supabase_realtime ADD TABLE live_locations;
   ```

5. **Add Test Data** (Optional)
   
   In Supabase SQL Editor:
   ```sql
   INSERT INTO trucks (truck_no, bid_number) VALUES 
   ('TN01AA1234', 'BID-001'),
   ('TN02BB5678', 'BID-002'),
   ('TN03CC9012', 'BID-003');

   INSERT INTO auth.users (email, encrypted_password) VALUES
   ('test@example.com', crypt('password123', gen_salt('bf')));
   ```

## Running the App

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Run on Android**
   ```bash
   npm run android
   ```
   
   Or in the Expo terminal, press `a`

3. **Run on iOS**
   ```bash
   npm run ios
   ```
   
   Or in the Expo terminal, press `i`

4. **Scan QR Code**
   - Open Expo Go app on your phone
   - Scan the QR code from the terminal
   - App will load in seconds

## Project Structure

```
CargoTracker/
├── App.tsx                    # Main entry point
├── supabase.ts               # Supabase client setup
├── gluestack-ui.config.ts    # UI theme config
├── app.json                  # Expo config
├── package.json              # Dependencies
├── screens/
│   ├── LoginScreen.tsx       # User authentication
│   ├── DashboardScreen.tsx   # Summary dashboard
│   ├── AddTripScreen.tsx     # Create new trip
│   ├── FuelStopScreen.tsx    # Add fuel refill
│   ├── UnloadScreen.tsx      # Mark unload
│   ├── TripsListScreen.tsx   # View all trips
│   └── LiveMapScreen.tsx     # Real-time tracking
└── assets/                   # App icons and splash screens
```

## Usage

### 1. Login
- Enter your Supabase credentials
- First time? Create a user in Supabase dashboard: Settings > Authentication > Users > Add User

### 2. Dashboard
- View trucks count, trips today, total weight, and fuel usage
- Quick navigation to all features

### 3. Add Trip
- Select truck from dropdown
- Enter bid number, quantity, chemical type
- Set departure plant
- Trip auto-starts tracking

### 4. During Trip
- Add fuel stops whenever needed
- Track multiple refills per trip

### 5. Complete Trip
- Mark as unloaded with destination
- System auto-calculates travel time

### 6. Monitor
- View all trips with date filter
- Check live truck locations on map
- Real-time updates as trucks move

## Database Schema

### trucks
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| truck_no | TEXT | Unique truck identifier |
| bid_number | TEXT | Associated bid |

### trips
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| truck_id | UUID | Foreign key to trucks |
| quantity_tons | NUMERIC | Cargo weight |
| chemical_type | TEXT | Chemical name |
| depart_time | TIMESTAMP | Start time |
| arrival_time | TIMESTAMP | End time |
| from_plant | TEXT | Origin |
| to_plant | TEXT | Destination |
| travel_time_minutes | NUMERIC | Auto-calculated |
| unloaded | BOOLEAN | Completion status |

### fuel_stops
| Column | Type | Notes |
|--------|------|-------|
| trip_id | UUID | Foreign key to trips |
| fuel_refilled_liters | NUMERIC | Fuel amount |
| stop_time | TIMESTAMP | When refilled |
| location | TEXT | Where refilled |

### live_locations (Real-time)
| Column | Type | Notes |
|--------|------|-------|
| truck_id | UUID | Primary key |
| latitude | NUMERIC | Current position |
| longitude | NUMERIC | Current position |
| updated_at | TIMESTAMP | Last update |

## Troubleshooting

### npm install fails
```bash
npm install --force
# Or
rm -rf node_modules package-lock.json
npm install
```

### Can't login
- Create user in Supabase: Authentication > Users > Add User
- Verify email and password match exactly
- Check Supabase URL and anon key are correct

### No data showing
- Verify tables exist in Supabase
- Check data was inserted (Supabase Dashboard > SQL)
- Ensure RLS policies allow reads (for testing, disable RLS)

### Map not showing
- Grant location permissions on phone
- Check Supabase realtime is enabled
- Verify live_locations table has data

### App crashes
- Check console for errors: `npm start` shows logs
- Verify all dependencies installed: `npm install`
- Clear cache: `expo start -c`

## API Reference

### Supabase Queries

```typescript
// Fetch trucks
const { data } = await supabase.from('trucks').select('*');

// Create trip
await supabase.from('trips').insert({ truck_id, quantity_tons, ... });

// Add fuel stop
await supabase.from('fuel_stops').insert({ trip_id, fuel_refilled_liters, ... });

// Subscribe to locations (Real-time)
supabase.channel('live')
  .on('postgres_changes', { event: '*', table: 'live_locations' }, callback)
  .subscribe();
```

## Configuration

### Supabase Keys
- Update `supabase.ts` with your project credentials
- Never commit keys to version control
- Use environment variables in production

### Theme
- Edit `gluestack-ui.config.ts` for colors and branding
- Modify `tailwind.config.js` for utility classes

## Performance Tips

- Use date filtering to reduce trips shown
- Enable pagination for large trip lists
- Batch location updates (10-30 second intervals)
- Use realtime subscriptions sparingly

## Security Notes

- Keep Supabase keys secure
- Use RLS policies for production
- Enable authentication before deployment
- Validate all user inputs

## Future Enhancements

- Driver and Manager role separation
- Trip history and analytics
- Fuel cost calculations
- GPS accuracy improvements
- Offline mode support
- Push notifications
- Export reports (PDF/Excel)
- Integration with third-party logistics

## Support

For issues:
1. Check console logs: `npm start`
2. Verify Supabase setup
3. Test with browser DevTools
4. Check network requests in Supabase dashboard

## License

MIT License - Free to use and modify

---

**Happy Tracking! 🚚📱**
