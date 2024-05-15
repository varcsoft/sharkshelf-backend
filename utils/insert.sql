-- Clear all tables
TRUNCATE TABLE users,cart,faq, "order", order_item, product, category, subcategory, address, review, wishlist, banner, popular, deal, contact RESTART IDENTITY CASCADE;

DO $$ 

DECLARE
  dynamic_image TEXT;
  token TEXT;

BEGIN

  -- dynamic_image := 'https://source.unsplash.com/1600x900/?product';
  dynamic_image := '{{image}}';
  token := '{{token}}';

  FOR i IN 1..200 LOOP
    INSERT INTO users (user_id,name,email,address,profile_pic, token,status,deleted_on, created_on, modified_on)
    VALUES
        (i,'shiva','shiva'||i||'@gmail.com','Address ' || i, dynamic_image,token,true,current_timestamp,current_timestamp, current_timestamp);
  END LOOP;
  -- Generate 100 FAQs with unique questions
  FOR i IN 1..100 LOOP
    INSERT INTO faq (question, answer, status, created_on, modified_on)
    VALUES
      ('Question ' || i, 'Answer ' || i,true, current_timestamp, current_timestamp);
  END LOOP;

  -- Generate Addresses for Users 1 to 50 (2 addresses each)
  FOR user_id IN 1..15 LOOP
    INSERT INTO address (user_id, address,city, state, postal_code, country, created_on, modified_on)
    VALUES
      ((user_id%15)+101, 'address ' || user_id || '_1', 'City ' || user_id || '_1', 'State ' || user_id || '_1', 'PostalCode ' || user_id || '_1', 'Country ' || user_id || '_1', current_timestamp, current_timestamp),
      ((user_id%15)+101, 'address ' || user_id || '_2', 'City ' || user_id || '_2', 'State ' || user_id || '_2', 'PostalCode ' || user_id || '_2', 'Country ' || user_id || '_2', current_timestamp, current_timestamp);
  END LOOP;

  -- Contact
  FOR i IN 1..50 LOOP
    INSERT INTO contact (name, email, phone, description, created_on, updated_on)
    VALUES
      ('Contact ' || i,'contact' || i || '@example.com','123-456-789' || i,'Description of contact ' || i,current_timestamp,current_timestamp);
  END LOOP;

  -- Categories
  INSERT INTO category (name,image, created_on, modified_on)
  VALUES
    ('Men',dynamic_image, current_timestamp, current_timestamp),
    ('Women',dynamic_image, current_timestamp, current_timestamp),
    ('Kids',dynamic_image, current_timestamp, current_timestamp),
    ('Electronics',dynamic_image, current_timestamp, current_timestamp),
    ('Home & Kitchen',dynamic_image, current_timestamp, current_timestamp),
    ('Sports',dynamic_image, current_timestamp, current_timestamp),
    ('Books',dynamic_image, current_timestamp, current_timestamp),
    ('Personal Care',dynamic_image, current_timestamp, current_timestamp);

  -- Subcategories for 'Men'
  FOR i IN 1..5 LOOP
    INSERT INTO subcategory (name, category_id, created_on, modified_on)
    VALUES
      (i || '_Men', 1, current_timestamp, current_timestamp),
      (i || '_Women', 2, current_timestamp, current_timestamp),
      (i || '_Kids', 3, current_timestamp, current_timestamp),
      (i || '_Electronics', 4, current_timestamp, current_timestamp),
      (i || '_Home', 5, current_timestamp, current_timestamp),
      (i || '_Sports', 6, current_timestamp, current_timestamp),
      (i || '_Books', 7, current_timestamp, current_timestamp),
      (i || '_PersonalCare', 8, current_timestamp, current_timestamp);
  END LOOP;

  -- Products
  FOR i IN 1..100 LOOP
    INSERT INTO product (specification,name, description, price, offer_price, color, size, rating, stock, images, category_id, subcategory_id, created_on, modified_on)
    VALUES
      ('High-quality casual shirt','Casual Shirt ' || i, 'High-quality casual shirt', random() * 50 + 20, random() * 10 + 10, 'Blue', 'M', random() * 5, floor(random() * 50), ARRAY[dynamic_image], 1, 1, current_timestamp, current_timestamp),
      ('High-quality casual shirt','Outerwear ' || i, 'Stylish outerwear for women', random() * 80 + 30, random() * 20 + 20, 'Black', 'L', random() * 5, floor(random() * 30), ARRAY[dynamic_image], 2, 2, current_timestamp, current_timestamp),
      ('High-quality casual shirt','Smartphone ' || i, 'Latest smartphone with advanced features', random() * 1000 + 300, random() * 100 + 100, 'Silver', NULL, random() * 5, floor(random() * 10), ARRAY[dynamic_image], 5, 13, current_timestamp, current_timestamp),
      ('High-quality casual shirt','Smartphone ' || i, 'Latest smartphone with advanced features', random() * 1000 + 300, random() * 100 + 100, 'Silver', NULL, random() * 5, floor(random() * 10), ARRAY[dynamic_image], 4, 12, current_timestamp, current_timestamp),
      ('High-quality casual shirt','Fitness Equipment ' || i, 'High-quality fitness equipment', random() * 100 + 50, random() * 30 + 30, 'Black', NULL, random() * 5, floor(random() * 20), ARRAY[dynamic_image], 6, 14, current_timestamp, current_timestamp),
      ('High-quality casual shirt','Fitness Equipment ' || i, 'High-quality fitness equipment', random() * 100 + 50, random() * 30 + 30, 'Black', NULL, random() * 5, floor(random() * 20), ARRAY[dynamic_image], 7, 15, current_timestamp, current_timestamp),
      ('High-quality casual shirt','Fitness Equipment ' || i, 'High-quality fitness equipment', random() * 100 + 50, random() * 30 + 30, 'Black', NULL, random() * 5, floor(random() * 20), ARRAY[dynamic_image], 8, 16, current_timestamp, current_timestamp);
  END LOOP;
 
 -- Cart
  FOR i IN 1..50 LOOP
    FOR j IN 1..3 LOOP
      INSERT INTO cart(user_id, product_id, quantity, created_on, modified_on)
      VALUES
        ((i%15)+101, floor(random() * 5) + 1,j, current_timestamp, current_timestamp);
    END LOOP;
  END LOOP;
  
  -- Orders
  FOR i IN 1..500 LOOP
    INSERT INTO "order" (total, payment_id, pay_method, delivery_status, order_mode, user_id, created_on, modified_on)
    VALUES
    (1000, 'payment' || i, 'method' || i, 'pending', 'mode' || i, (i%15)+101, current_timestamp, current_timestamp);
  END LOOP;

  -- Order Items
  FOR i IN 1..100 LOOP
    INSERT INTO order_item (quantity, product_id, order_id)
    VALUES
      (floor(random() * 5) + 1, floor(random() * 100) + 1, i);
  END LOOP;

  -- Wishlist
  FOR i IN 1..50 LOOP
    FOR j IN 1..2 LOOP
      INSERT INTO wishlist (user_id, product_id, created_on, modified_on)
      VALUES
        ((i%15)+101, floor(random() * 100) + 1, current_timestamp, current_timestamp);
    END LOOP;
  END LOOP;

  -- Popular
  FOR i IN 1..50 LOOP
    INSERT INTO popular (product_id, created_on, modified_on)
    VALUES
      (floor(random() * 100) + 1, current_timestamp, current_timestamp);
  END LOOP;

  -- Deal
  FOR i IN 1..50 LOOP
    INSERT INTO deal (product_id, created_on, modified_on)
    VALUES
      (floor(random() * 100) + 1, current_timestamp, current_timestamp);
  END LOOP;

  -- Reviews
  FOR i IN 1..700 LOOP
    INSERT INTO review (user_id, product_id, rating, comment, created_on, modified_on)
    VALUES
      ((i%15)+101, i, random() * 5, 'Review ' || i, current_timestamp, current_timestamp),
      ((i%15)+101, i, random() * 5, 'Review ' || i, current_timestamp, current_timestamp),
      ((i%15)+101, i, random() * 5, 'Review ' || i, current_timestamp, current_timestamp);
  END LOOP;

END $$;