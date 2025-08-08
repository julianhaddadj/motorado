# Motorado – Car Marketplace for UAE

Motorado is a full‑stack marketplace application for buying and selling cars in the United Arab Emirates.  The platform allows individuals and dealerships to list vehicles for sale while buyers can browse, search, filter and save favourites.  All listings require admin approval before they appear publicly.  Motorado is completely bilingual (English/Arabic) and mobile‑friendly.

## Project structure

The code base is divided into a backend API built with **Node.js**/**Express.js** and a frontend built with **React** (via Vite) and **Tailwind CSS**.  Both parts live inside the `motorado` directory:

```text
motorado/
│
├── backend/        # Node/Express API
│   ├── src/
│   │   ├── config/      # Database connection
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Auth, role and upload middleware
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # Route definitions
│   │   └── server.js    # Express server entry point
│   ├── package.json     # Backend dependencies and scripts
│   └── .env.example     # Environment variables sample
│
├── frontend/       # React client (Vite + Tailwind)
│   ├── src/
│   │   ├── api/        # Utility functions to call the backend
│   │   ├── components/ # Shared UI components
│   │   ├── contexts/   # Global context providers (auth, language)
│   │   ├── i18n/       # Translation files for English/Arabic
│   │   └── pages/      # Application pages (home, login, admin etc.)
│   ├── public/         # Static assets
│   ├── index.html      # Vite entry point
│   ├── package.json    # Frontend dependencies and scripts
│   └── tailwind.config.js
│
└── README.md       # You are here
```

## Features

- **User roles:** buyers can browse and favourite cars without creating listings.  Sellers (individuals or dealerships) can list vehicles.  Admins must approve listings before they are visible.  Roles are stored on the user model and enforced via middleware.
- **Authentication:** users sign up with their name, email and password.  Passwords are hashed using bcrypt and JWT tokens are issued for authenticated requests.  Email/password is the only supported authentication method (no social login).
- **Listings:** sellers can create car listings with fields such as make, model, year, price, mileage, engine, transmission, colour, body type, city and a description.  Multiple photos can be uploaded (stored in Amazon S3).  Each listing has a status of *Pending*, *Approved* or *Rejected* and cannot be viewed by the public until approved by an admin.
- **Search and filters:** buyers can search and filter listings by make, model, price range, year range, mileage, city, body type, colour and seller type (dealer or individual).  Results can be sorted by most recent, price low→high or price high→low.
- **Favourites:** authenticated buyers can save listings to their favourites for easy reference.  Favourites are stored on the user document.
- **Admin dashboard:** admins can view all users and listings, approve or reject listings and delete any listing.  An optional `role` query allows filtering users by role.
- **Bilingual UI:** the frontend uses a simple `i18n` configuration to provide English and Arabic translations for UI labels.  A toggle in the header allows switching languages on any page.
- **Mobile friendly:** Tailwind CSS makes it easy to build responsive layouts.  The design follows a clean, modern aesthetic inspired by property marketplaces.  Car‑themed accent colours (blues/greys) are used throughout.
- **Environment‑based configuration:** all secrets (MongoDB URI, JWT secret, AWS keys, etc.) are supplied via environment variables.  Sample `.env.example` files show the required keys.

## Prerequisites

- **Node.js** ≥ 18
- **MongoDB Atlas** account and connection string
- **AWS S3** bucket (or Cloudinary account if you choose to adapt the upload middleware)
- **npm** or **yarn**

## Getting started locally

Follow these steps to set up and run Motorado on your local machine.

1. **Clone the repository**

   ```bash
   git clone https://github.com/your‑username/motorado.git
   cd motorado
   ```

2. **Backend setup**

   ```bash
   cd backend
   # Install dependencies
   npm install
   # Copy the sample environment variables file and fill in your values
   cp .env.example .env
   # Edit .env with your MongoDB URI, JWT secret and S3 credentials
   # Run the server in development mode
   npm run dev
   ```

   The backend will start on port `5000` by default.  It connects to MongoDB, configures CORS to allow requests from the frontend and exposes REST endpoints under `/api`.

3. **Frontend setup**

   ```bash
   cd ../frontend
   # Install dependencies
   npm install
   # Start the development server
   npm run dev
   ```

   The frontend will start on port `5173`.  It proxies API requests to the backend using Vite’s development proxy (configured in `vite.config.js`).  You can now visit [http://localhost:5173](http://localhost:5173) to explore the application.

## Deployment

### Backend

The backend can be deployed to services such as [Render](https://render.com) or [Railway](https://railway.app).  Both provide simple Git‑based deployments and free tiers.  Be sure to set the environment variables (MongoDB URI, JWT secret, AWS credentials and bucket name) via the provider’s dashboard.

### Frontend

The React application can be hosted on [Vercel](https://vercel.com) or [Netlify](https://www.netlify.com).  These platforms automatically detect Vite projects and build them.  You need to set a `VITE_API_URL` environment variable pointing to your deployed backend.  After deployment, update the `CLIENT_URL` variable in your backend’s environment so that CORS is configured correctly.

## Sample data

To get started quickly you can create a few users and listings using the API.  Use the `/api/auth/register` endpoint to create an admin (set `role` to `admin` manually in the database) and some sellers/buyers.  Then authenticate and call `/api/listings` with a multipart/form‑data body containing listing fields and up to 8 images (field name `images`).  Once created, log in as the admin and use the `/api/admin/listings/:id/approve` endpoint to approve listings.

## Continuous integration

The repository includes a basic GitHub Actions workflow (see `.github/workflows/ci.yml`) that runs `npm install` and `npm run build` for both the backend and the frontend.  You can extend this to run ESLint checks or unit tests as your project grows.

## Future enhancements

The Motorado MVP lays the foundation for a robust marketplace.  Future improvements could include:

- Payment integration for premium listings or highlighted placements.
- Internal messaging between buyers and sellers.
- Dealer profile pages showcasing all active listings.
- SEO enhancements such as server‑side rendering or pre‑rendering for listing pages.
- Unit and integration tests using Jest and React Testing Library.
- Reporting and analytics for sellers and admins.

## References

Motorado borrows the general concept of an online marketplace, defined by Wikipedia as an e‑commerce website where product information is provided by multiple third parties and shoppers can browse a wide selection of goods【565573486547182†L154-L170】.  Online marketplaces aggregate products from many providers, offering greater selection and availability than vendor‑specific stores【565573486547182†L164-L172】.  These platforms typically allow users to register, list items for sale and search or filter listings【565573486547182†L159-L166】.  Motorado applies these principles to the used‑car market in the UAE, adding administration workflows and bilingual support.