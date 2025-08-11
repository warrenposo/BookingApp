# 🎨 Gradient Components Guide

This guide shows you how to use the beautiful gradient components we've added to make your app more appealing and modern.

## 🌈 Available Gradient Components

### 1. **GradientView** - Base Gradient Component
The foundation for all gradient components.

```javascript
import { 
  GradientView, 
  PrimaryGradient, 
  OceanGradient, 
  SunsetGradient,
  ModernGradient,
  TechGradient 
} from '../components/GradientView';

// Basic usage
<GradientView gradient="primary" style={styles.container}>
  <Text>Your content here</Text>
</GradientView>

// Predefined gradients
<PrimaryGradient style={styles.header}>
  <Text style={styles.title}>Primary Header</Text>
</PrimaryGradient>

<OceanGradient style={styles.card}>
  <Text>Ocean themed card</Text>
</OceanGradient>
```

### 2. **GradientButton** - Beautiful Gradient Buttons
Create stunning buttons with different variants and sizes.

```javascript
import { 
  GradientButton,
  PrimaryButton,
  SuccessButton,
  OceanButton,
  SmallButton,
  LargeButton 
} from '../components/GradientButton';

// Basic button
<GradientButton
  title="Click Me"
  onPress={() => console.log('Pressed!')}
  variant="primary"
  size="medium"
/>

// Predefined variants
<PrimaryButton title="Primary Action" onPress={handlePress} />
<SuccessButton title="Success Action" onPress={handlePress} />
<OceanButton title="Ocean Action" onPress={handlePress} />

// Different sizes
<SmallButton title="Small" onPress={handlePress} />
<LargeButton title="Large" onPress={handlePress} />

// With icons
<GradientButton
  title="Add Item"
  icon="add"
  onPress={handlePress}
/>

// Loading state
<GradientButton
  title="Processing"
  loading={true}
  onPress={handlePress}
/>
```

### 3. **GradientCard** - Gradient Cards
Create beautiful cards with gradient backgrounds.

```javascript
import { 
  GradientCard,
  PrimaryCard,
  OceanCard,
  SunsetCard,
  SmallCard,
  LargeCard,
  StatsCard,
  InfoCard
} from '../components/GradientCard';

// Basic card
<GradientCard variant="primary" style={styles.card}>
  <Text>Card content</Text>
</GradientCard>

// Predefined variants
<PrimaryCard>
  <Text>Primary themed card</Text>
</PrimaryCard>

<OceanCard>
  <Text>Ocean themed card</Text>
</OceanCard>

// Different sizes
<SmallCard>
  <Text>Small card</Text>
</SmallCard>

<LargeCard>
  <Text>Large card</Text>
</LargeCard>

// Special purpose cards
<StatsCard
  value="42"
  label="Properties"
  icon={<Ionicons name="home" size={24} color="white" />}
  variant="ocean"
/>

<InfoCard
  title="Information"
  description="This is an info card with gradient background"
  icon={<Ionicons name="information" size={24} color="white" />}
/>
```

### 4. **GradientInput** - Gradient Input Fields
Beautiful input fields with gradient borders.

```javascript
import { 
  GradientInput,
  PrimaryInput,
  ModernInput,
  OceanInput,
  EmailInput,
  PasswordInput,
  PhoneInput,
  SearchInput
} from '../components/GradientInput';

// Basic input
<GradientInput
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  variant="primary"
/>

// Predefined variants
<PrimaryInput
  label="Name"
  placeholder="Enter your name"
  value={name}
  onChangeText={setName}
/>

<ModernInput
  label="Username"
  placeholder="Choose username"
  value={username}
  onChangeText={setUsername}
/>

// Specialized inputs
<EmailInput
  value={email}
  onChangeText={setEmail}
/>

<PasswordInput
  value={password}
  onChangeText={setPassword}
  showPassword={showPassword}
  onTogglePassword={() => setShowPassword(!showPassword)}
/>

<PhoneInput
  value={phone}
  onChangeText={setPhone}
/>

<SearchInput
  value={searchQuery}
  onChangeText={setSearchQuery}
  onSearch={handleSearch}
/>
```

### 5. **GradientHeader** - Gradient Headers
Beautiful gradient headers for your screens.

```javascript
import { 
  GradientHeader,
  PrimaryHeader,
  OceanHeader,
  BackHeader,
  MenuHeader,
  SearchHeader,
  ProfileHeader
} from '../components/GradientHeader';

// Basic header
<GradientHeader
  title="Screen Title"
  subtitle="Screen description"
  variant="primary"
/>

// Predefined variants
<PrimaryHeader
  title="Welcome"
  subtitle="Start your journey"
/>

<OceanHeader
  title="Properties"
  subtitle="Find your perfect stay"
/>

// Common patterns
<BackHeader
  title="Property Details"
  subtitle="View property information"
  onBack={() => navigation.goBack()}
/>

<MenuHeader
  title="Dashboard"
  subtitle="Manage your properties"
  onMenu={() => navigation.openDrawer()}
/>

<SearchHeader
  title="Search"
  subtitle="Find properties"
  onSearch={handleSearch}
  onBack={() => navigation.goBack()}
/>

<ProfileHeader
  title="Profile"
  subtitle="Manage your account"
  onEdit={handleEdit}
  onBack={() => navigation.goBack()}
/>
```

## 🎯 Available Gradient Variants

### Color Schemes
- **primary**: Blue to Purple (`#007AFF` → `#5856D6`)
- **secondary**: Purple to Light Purple (`#5856D6` → `#7B79E6`)
- **success**: Green to Light Green (`#34C759` → `#5CDB7A`)
- **warning**: Orange to Light Orange (`#FF9500` → `#FFB84D`)
- **error**: Red to Light Red (`#FF3B30` → `#FF6B6B`)
- **ocean**: Blue to Green (`#007AFF` → `#34C759`)
- **sunset**: Red to Orange (`#FF6B6B` → `#FFB84D`)
- **modern**: Blue to Purple (`#667eea` → `#764ba2`)
- **warm**: Pink to Red (`#f093fb` → `#f5576c`)
- **cool**: Blue to Cyan (`#4facfe` → `#00f2fe`)
- **tech**: Blue to Cyan (`#4facfe` → `#00f2fe`)
- **nature**: Teal to Pink (`#a8edea` → `#fed6e3`)

## 📱 Component Sizes

### Buttons
- **small**: 8px padding, 14px font
- **medium**: 14px padding, 16px font (default)
- **large**: 18px padding, 18px font

### Cards
- **default**: 20px padding, 16px border radius
- **small**: 12px padding, 12px border radius
- **large**: 28px padding, 20px border radius

### Inputs
- **small**: 8px padding, 40px height, 14px font
- **medium**: 12px padding, 48px height, 16px font (default)
- **large**: 16px padding, 56px height, 18px font

### Headers
- **default**: 120px height
- **small**: 80px height
- **large**: 160px height

## 🎨 Usage Examples

### Complete Screen with Gradients
```javascript
import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { PrimaryHeader, OceanCard, SuccessButton, ModernInput } from '../components';

export default function BeautifulScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      {/* Beautiful gradient header */}
      <PrimaryHeader
        title="Welcome Back"
        subtitle="Discover amazing properties"
        leftIcon={<Ionicons name="menu" size={24} color="white" />}
        onLeftPress={() => navigation.openDrawer()}
      />
      
      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Gradient input */}
        <ModernInput
          label="Search Properties"
          placeholder="Enter location or property type"
          leftIcon={<Ionicons name="search" size={20} color="#8E8E93" />}
        />
        
        {/* Gradient cards */}
        <OceanCard style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            Featured Properties
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 8 }}>
            Check out our top picks
          </Text>
        </OceanCard>
        
        {/* Gradient button */}
        <SuccessButton
          title="Explore More"
          icon="arrow-forward"
          size="large"
          onPress={() => navigation.navigate('Explore')}
        />
      </ScrollView>
    </View>
  );
}
```

### Custom Gradient Combinations
```javascript
import { GradientView } from '../components/GradientView';

// Custom gradient colors
<GradientView
  colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.customGradient}
>
  <Text style={{ color: 'white' }}>Custom Gradient</Text>
</GradientView>

// Random gradient
import { getRandomGradient } from '../constants/colors';

<GradientView
  colors={getRandomGradient()}
  style={styles.randomGradient}
>
  <Text style={{ color: 'white' }}>Random Gradient</Text>
</GradientView>
```

## 🚀 Best Practices

### 1. **Consistent Usage**
- Use the same gradient variant for similar elements (e.g., all primary actions use `primary` variant)
- Maintain consistent spacing and sizing across components

### 2. **Accessibility**
- Ensure sufficient contrast between text and gradient backgrounds
- Use appropriate text colors (white text on dark gradients, dark text on light gradients)

### 3. **Performance**
- Gradients are rendered efficiently using `expo-linear-gradient`
- Avoid creating too many gradient components on the same screen

### 4. **Visual Hierarchy**
- Use primary gradients for main actions and headers
- Use secondary gradients for supporting elements
- Use success/warning/error gradients for status indicators

## 🎨 Customization

### Extending Colors
Add new gradient combinations to `src/constants/colors.js`:

```javascript
gradients: {
  // ... existing gradients
  custom: ['#FF6B6B', '#4ECDC4'],
  brand: ['#FFD93D', '#FF6B6B'],
}
```

### Custom Components
Create specialized components using the base gradient components:

```javascript
const CustomFeatureCard = ({ title, description, icon }) => (
  <SunsetCard>
    <View style={styles.featureContent}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  </SunsetCard>
);
```

## 🔧 Troubleshooting

### Common Issues
1. **Gradient not showing**: Ensure `expo-linear-gradient` is properly installed
2. **Performance issues**: Limit the number of gradient components per screen
3. **Text visibility**: Use appropriate text colors for gradient backgrounds

### Debugging
- Check console for any gradient-related errors
- Verify component imports are correct
- Ensure gradient variant names match exactly

---

## 🎉 Conclusion

With these gradient components, your app now has:
- ✨ Beautiful, modern UI elements
- 🎨 Consistent design language
- 🔧 Easy-to-use, reusable components
- 📱 Professional appearance
- 🚀 Better user engagement

Start using these components throughout your app to create a stunning, gradient-rich user experience! 🌈
