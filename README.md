# Database Schema for Order and Agency Management

This project manages customer orders and agency information. Below are the SQL commands to create the two primary tables: `t_order` (for order data) and `t_agency` (for agency data).

## Instructions for Creating the Tables

1. Copy the SQL scripts provided below.
2. Run them in your MySQL database client (e.g., MySQL Workbench, phpMyAdmin, or terminal).
3. After execution, the `t_order` and `t_agency` tables will be created in your database.

## SQL Table Definitions

### 1. `t_order`

This table stores information related to customer orders, including the quantity of items ordered, depositor details, and order status.

#### Columns:
- `seq` (`INT`, `AUTO_INCREMENT`, `PRIMARY KEY`): Unique identifier for each order.
- `name` (`VARCHAR(100)`): Customer's name.
- `phone_country` (`VARCHAR(10)`): Country code for the customer's phone number.
- `phone_number` (`VARCHAR(15)`): Customer's phone number.
- `postcode` (`VARCHAR(10)`): Postcode of the delivery address.
- `address` (`VARCHAR(255)`): Full address for delivery.
- `detail_address` (`VARCHAR(255)`): Additional address details (e.g., apartment number).
- `order_quantity` (`INT`): Quantity of items ordered.
- `depositor_name` (`VARCHAR(100)`): Name of the depositor making the payment.
- `referral_code` (`VARCHAR(50)`): Referral code associated with the agency.
- `deposit_status` (`CHAR(1)`): Indicates if payment has been made. Default is 'N' (waiting for deposit).
- `delivery_status` (`CHAR(1)`): Indicates delivery status. Default is 'N' (not yet delivered).
- `ordDt` (`DATE`): Date the order was placed.
- `regDt` (`DATETIME`): Date and time the order was registered in the system.

#### SQL Command:

```sql
CREATE TABLE t_order (
  seq INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  phone_country VARCHAR(10),
  phone_number VARCHAR(15),
  postcode VARCHAR(10),
  address VARCHAR(255),
  detail_address VARCHAR(255),
  order_quantity INT,
  depositor_name VARCHAR(100),
  referral_code VARCHAR(50),
  deposit_status CHAR(1) DEFAULT 'N',  -- 'N' indicates waiting for deposit
  delivery_status CHAR(1) DEFAULT 'N',  -- 'N' indicates not yet delivered
  ordDt DATE,          -- Date of order placement
  regDt DATETIME       -- Date and time when the order was registered
);
```


### 2. `t_agency`

This table stores information about the agencies placing orders. Each agency has a unique phone number and referral code.

#### Columns:
- `id` (`INT`, `AUTO_INCREMENT`, `PRIMARY KEY`): Unique identifier for each agency.
- `name` (`VARCHAR(100)`): Agency's name.
- `grade` (`CHAR(1)`): Grade classification for the agency (e.g., A, B, C).
- `phone_country` (`VARCHAR(10)`): Country code for the agency's phone number.
- `phone_number` (`VARCHAR(15)`): Unique phone number for each agency.
- `referral_code` (`VARCHAR(64)`): Unique referral code assigned to the agency.
- `password` (`VARCHAR(255)`): Hashed password for the agency's login.

#### SQL Command:

```sql
CREATE TABLE t_agency (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  grade CHAR(1),  -- Grade classification for the agency
  phone_country VARCHAR(10),
  phone_number VARCHAR(15) UNIQUE,  -- Unique phone number for each agency
  referral_code VARCHAR(64) UNIQUE, -- Unique referral code for the agency
  password VARCHAR(255)  -- Hashed password for agency login
);
```