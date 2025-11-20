# Deployment Guide: GoDaddy + Netlify

Since you bought your domain from **GoDaddy**, here is the exact step-by-step process to make your website live.

## Step 1: Put Website Online (Netlify)
1.  Go to [Netlify Drop](https://app.netlify.com/drop).
2.  Drag and drop your **`taptotravel-website`** folder.
3.  Your site will be live instantly on a random link (e.g., `cool-site-123.netlify.app`).
4.  Click **"Site Settings"** > **"Change site name"** to something simple like `taptotravel-official`.

## Step 2: Connect Domain in Netlify
1.  In Netlify, go to **"Domain Management"**.
2.  Click **"Add a domain"**.
3.  Type `taptotravel.co.in` and click **Verify**.
4.  Click **"Add domain"**.
5.  Netlify will say "Check DNS configuration". Note down the **Netlify Load Balancer IP** (usually `75.2.60.5`).

## Step 3: Configure GoDaddy (Crucial Step)
1.  Log in to your **GoDaddy Account**.
2.  Go to **"My Products"** and find `taptotravel.co.in`.
3.  Click on **"DNS"** or **"Manage DNS"**.
4.  **Update the Records:**

    ### A Record (Points the domain)
    *   Look for a record with Type **A** and Name **@**.
    *   Edit it (pencil icon) or Add New if missing.
    *   **Name:** `@`
    *   **Value:** `75.2.60.5`
    *   **TTL:** `600 seconds` (or default)
    *   *Note: Delete any other 'A' records with name '@' if they exist.*

    ### CNAME Record (Points www)
    *   Look for a record with Type **CNAME** and Name **www**.
    *   Edit it.
    *   **Name:** `www`
    *   **Value:** `taptotravel-official.netlify.app` (Replace with your actual Netlify link from Step 1, **without** https://)
    *   **TTL:** `600 seconds` (or default)

## Step 4: Wait & Verify
*   DNS changes can take **10 minutes to 24 hours** to propagate.
*   Go back to Netlify and click **"Verify DNS"**.
*   Once verified, Netlify will automatically issue a **Free SSL Certificate** (HTTPS) within a few minutes.

**🎉 Done! Your website will be live at https://taptotravel.co.in**
