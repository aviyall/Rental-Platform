from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os

username = os.getenv('USERNAME_SUPABASE')
password = os.getenv('PASSWORD_SUPABASE')

app = Flask(__name__)
CORS(app)

# Database connection settings
DB_CONFIG = {
    "user": f"{username}",
    "password": f"{password}",
    "host": "aws-0-ap-southeast-1.pooler.supabase.com",
    "port": "5432",
    "dbname": "postgres"
}

def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except psycopg2.OperationalError as e:
        print(f"Database connection error: {e}")
        return None

@app.route('/api/category-items/<category_name>')
def category_items(category_name):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Could not connect to the database"}), 500

    category_headings = {
        'digital': 'Digital Devices',
        'electronics': 'Electronics',
        'powertools': 'Power Tools',
        'featured': 'Featured Products'
    }

    if category_name not in category_headings:
        return jsonify({"error": "Invalid category"}), 400

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            if category_name == 'featured':
                cursor.execute(
                    "SELECT id, name, description, image_url FROM products WHERE sub_category = %s;",
                    ('featured',)
                )
            else:
                cursor.execute(
                    "SELECT id, name, description, image_url FROM products WHERE category = %s;",
                    (category_name,)
                )
            products = cursor.fetchall()
            return jsonify({
                "heading": category_headings[category_name],
                "products": products
            })
    except Exception as e:
        print(f"Query error: {e}")
        return jsonify({"error": "Error fetching products"}), 500
    finally:
        conn.close()

@app.route('/api/product/<int:product_id>')
def get_product(product_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Could not connect to the database"}), 500

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT id, name, description, price, fake_price, discount_percentage,
                       image_url, images
                FROM products
                WHERE id = %s;
            """, (product_id,))
            product = cursor.fetchone()

        if product is None:
            return jsonify({"error": "Product not found"}), 404

        # Safe handling of images (in case it's NULL in DB)
        raw_images = product.get("images") or ""
        image_list = [img.strip() for img in raw_images.split(",") if img.strip()]
        product["images"] = image_list[:3]

        return jsonify({"product": product})
    except Exception as e:
        print(f"Query error: {e}")
        return jsonify({"error": "Error fetching product"}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
