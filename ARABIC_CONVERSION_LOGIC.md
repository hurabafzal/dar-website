# Arabic Conversion Logic & Steps

## Overview
The application uses a **Context-based internationalization (i18n) system** to support language switching between English and Arabic. This is a manual implementation without i18next or react-i18next libraries.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Application Flow                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │   AuthProvider      │
                    │  (AuthContext.tsx)  │
                    └─────────────────────┘
                    ↙                     ↘
        ┌──────────────────┐    ┌──────────────────────┐
        │  Cookie Storage  │    │  JSON Message Files  │
        │  (language)      │    │  (ar.json, en.json)  │
        └──────────────────┘    └──────────────────────┘
                    ↓                     ↓
        ┌──────────────────────────────────────────┐
        │    State Management                      │
        │  - language: "en" | "ar"                │
        │  - messages: object (loaded JSON)       │
        └──────────────────────────────────────────┘
                              ↓
        ┌──────────────────────────────────────────┐
        │    Components use useAuth() hook         │
        │  - Header, Home, Projects, WhyDar, etc  │
        └──────────────────────────────────────────┘
                              ↓
        ┌──────────────────────────────────────────┐
        │    Display Messages in Current Language  │
        │  - messages?.section?.key                │
        └──────────────────────────────────────────┘
```

---

## Step-by-Step Conversion Process

### **Step 1: Initial Language Setup**
**File:** `src/context/AuthContext.tsx`

```tsx
// Default language is set to English
const [language, setLanguage] = useState("en");
const [messages, setMessages] = useState<any>(null);
```

**Location:** Lines 25-26

When the app initializes, the language defaults to English.

---

### **Step 2: Load Stored Language Preference**
**File:** `src/context/AuthContext.tsx` (within `updateUserData()` function)

```tsx
const updateUserData = async () => {
  const userData = (await getUserData()) as any;
  const data = (await getAuthCookie("language")) as any;
  setLanguage(data?.value);  // Load from browser cookie
  setUser(userData);
};

useEffect(() => {
  updateUserData();
}, []);
```

**Location:** Lines 28-34

**What happens:**
- When the AuthProvider mounts (on app load), it retrieves the stored language preference from browser cookies
- If a cookie exists with the user's previous language choice, it sets that language
- Otherwise, defaults to "en"

---

### **Step 3: Watch for Language Changes**
**File:** `src/context/AuthContext.tsx`

```tsx
useEffect(() => {
  loadMessages();
}, [language]);  // Runs whenever language changes
```

**Location:** Lines 40-42

**What happens:**
- Whenever the `language` state changes, this effect triggers
- It calls `loadMessages()` to load the appropriate JSON file

---

### **Step 4: Load Messages from JSON Files**
**File:** `src/context/AuthContext.tsx`

```tsx
const loadMessages = async () => {
  try {
    const messagesModule = await import(`../messages/${language}.json`);
    setMessages(messagesModule.default);
  } catch (error) {
    console.error("Error loading language file", error);
  }
};
```

**Location:** Lines 44-49

**What happens:**
- Uses **dynamic import** with template literal to load the appropriate JSON file
- If `language === "ar"`, it loads `src/messages/ar.json`
- If `language === "en"`, it loads `src/messages/en.json`
- The loaded object is stored in the `messages` state
- All component text is provided by this loaded JSON

---

### **Step 5: Expose Language & Messages via Context**
**File:** `src/context/AuthContext.tsx`

```tsx
return (
  <AuthContext.Provider
    value={{ user, setUser, updateUserData, language, setLanguage, messages }}
  >
    {children}
  </AuthContext.Provider>
);
```

**Location:** Lines 52-57

**What happens:**
- The context provides:
  - `language`: Current language code ("en" or "ar")
  - `setLanguage`: Function to change language
  - `messages`: The loaded JSON object with all translations

---

### **Step 6: Persist Language Choice to Cookie**
**File:** `src/lib/cookies/setCookies.ts`

```tsx
export async function setLanguageCookie(lan: string) {
  const cookieStore = await cookies();
  cookieStore.set("language", lan, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,  // 24 hours
    path: "/",
  });
}
```

**Location:** Lines 13-18

**What happens:**
- When user changes language, the cookie is updated
- Cookie persists for 24 hours
- Next time user visits, their language preference is restored

---

### **Step 7: Handle Language Selection in UI**
**File:** `src/components/Header/Header.tsx`

```tsx
const { user, setUser, language, setLanguage, messages } = useAuth();

const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setLanguage(e.target.value);        // Update context state
  setLanguageCookie(e.target.value);  // Update browser cookie
};

// UI selector
<select
  value={language}
  onChange={handleLanguageChange}
  className="w-28 text-lg font-semibold text-gray-700 bg-white rounded-lg focus:outline-none"
>
  <option value="en">En 🇺🇸</option>
  <option value="ar">عربي 🇸🇦</option>
</select>
```

**Location:** Lines 19, 32-33, 104-112

**What happens:**
- User selects language from dropdown in Header
- `handleLanguageChange` fires
- Both the context state AND the cookie are updated
- This triggers the `useEffect` in AuthContext (Step 3)
- Which loads the new messages (Step 4)
- All components automatically re-render with new text

---

### **Step 8: Use Messages in Components**
**File:** `src/components/Header/Header.tsx` (example)

```tsx
const { user, setUser, language, setLanguage, messages } = useAuth();

// Build navigation headers from messages
const headers = [
  messages?.header?.appointment,
  messages?.header?.aboutUs,
  messages?.header?.projects,
  messages?.header?.catalog,
];

// Display text from messages
<Button text={messages?.header?.login} onClick={openAuthModal} />
<Button text={messages?.header?.logout} onClick={...} />
```

**Location:** Lines 19, 23-29, 115-117

**What happens:**
- Components extract `messages` from the `useAuth()` hook
- Access text using dot notation: `messages?.section?.key`
- If language is "ar", gets Arabic text from `ar.json`
- If language is "en", gets English text from `en.json`
- Uses optional chaining (`?.`) for safety

---

## Message File Structure

### **File:** `src/messages/en.json` & `src/messages/ar.json`

```json
{
  "header": {
    "contactUs": "CONTACT US" / "اتصل بنا",
    "projects": "PROJECTS" / "المشاريع",
    "catalog": "CATALOG" / "الكتالوج",
    "appointment": "APPOINTMENT" / "موعد",
    "aboutUs": "ABOUT US" / "معلومات عنا",
    "login": "LOGIN" / "تسجيل الدخول",
    "logout": "LOGOUT" / "تسجيل الخروج",
    "welcome": "Welcome" / "مرحباً"
  },
  "home": {...},
  "aboutUs": {...},
  "projects": {...},
  "catalog": {...},
  "whyDar": {...},
  "aboutDar": {...},
  "signup": {...},
  "footer": {...}
}
```

**Structure:**
- Nested JSON object with language-specific text
- Same keys in both files (en.json and ar.json)
- Different values based on language

---

## Components Using This System

| Component | Location | Usage |
|-----------|----------|-------|
| **Header** | `src/components/Header/Header.tsx` | Navigation text, login/logout buttons |
| **Home** | `src/components/Home/Home.tsx` | Home page content |
| **WhyDar** | `src/components/WhyDar/WhyDar.tsx` | Why choose Dar section |
| **Projects** | `src/components/Projects/ProjectsComponent.tsx` | Projects display |
| **Footer** | `src/components/Footer/Footer.tsx` | Footer content |

---

## Complete Data Flow Summary

```
1. App Loads
   ↓
2. AuthProvider initializes with default language "en"
   ↓
3. updateUserData() runs → retrieves stored language from cookie
   ↓
4. If cookie exists, language state updates → triggers useEffect
   ↓
5. loadMessages() dynamically imports appropriate JSON file
   ↓
6. Messages populate context state
   ↓
7. Components render with useAuth() hook
   ↓
8. User changes language in Header dropdown
   ↓
9. setLanguage() updates context state
   ↓
10. setLanguageCookie() persists choice (24 hours)
    ↓
11. useEffect detects language change → calls loadMessages()
    ↓
12. New JSON (ar.json or en.json) is imported
    ↓
13. Context updates messages → all components re-render
    ↓
14. UI displays in selected language
```

---

## Key Technologies & Patterns Used

| Technology/Pattern | Purpose | Location |
|-------------------|---------|----------|
| **React Context API** | Global state management | `AuthContext.tsx` |
| **useContext Hook** | Component consumption of context | All components |
| **Dynamic Imports** | Load language files based on selection | `loadMessages()` |
| **Next.js Cookies API** | Persist user preference | `setCookies.ts` |
| **JSON Files** | Store translations | `ar.json`, `en.json` |
| **useEffect Hook** | Trigger message loading on language change | `AuthContext.tsx` |
| **useState Hook** | Track language and messages state | `AuthContext.tsx` |

---

## Edge Cases & Handling

| Scenario | Handling |
|----------|----------|
| First-time user | Defaults to "en", no stored cookie |
| Cookie expired | Falls back to default "en" |
| Missing translation key | Optional chaining prevents errors: `messages?.section?.key` |
| Rapid language switching | Latest value wins, previous async load ignored |
| Component unmounts during load | useEffect cleanup prevents memory leaks |

---

## File Dependencies Map

```
src/
├── app/
│   └── layout.tsx (wraps with AuthProvider)
│
├── context/
│   └── AuthContext.tsx ⭐ (Core logic)
│       ├── Imports: getUserData, getAuthCookie
│       └── Exports: useAuth hook
│
├── lib/cookies/
│   └── setCookies.ts (Cookie operations)
│       ├── setLanguageCookie()
│       └── getAuthCookie()
│
├── messages/
│   ├── ar.json ⭐ (Arabic translations)
│   └── en.json ⭐ (English translations)
│
└── components/
    ├── Header/Header.tsx (Main language selector)
    ├── Home/Home.tsx (Uses messages)
    ├── WhyDar/WhyDar.tsx (Uses messages)
    ├── Projects/ProjectsComponent.tsx (Uses messages)
    └── ... (Other components that use useAuth)
```

---

## Summary

The Arabic conversion system is built on **React Context + JSON-based translations** with the following flow:

1. **Storage**: Language preference saved in browser cookies
2. **Context**: Global state via React Context API
3. **Loading**: Dynamic JSON imports based on selected language
4. **Usage**: Components access `messages` through `useAuth()` hook
5. **Persistence**: Language choice saved for 24 hours

This is a **lightweight i18n implementation** without external i18n libraries, making it simple and maintainable.
