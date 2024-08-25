# Circuits to Verify Requirements

> Warning, this circuits are not being used because of time restrinctions.

Collection of circuits implemented using the Noir. The circuits are designed to perform various verifications such as age verification, nationality verification, and attendance verification. Additionally, a multimodal circuit combines these individual verifications into a single eligibility check.

## Structure

1. **Age Verification** (`age_verification`): Checks if a participant's age falls within a specified range.
2. **Nationality Verification** (`nationality`): Verifies if a participant's nationality matches a required nationality.
3. **Attendance Verification** (`attendance`): Checks if a participant's attendance status meets the required status.
4. **Multimodal Verification** (`multimodal`): Combines the results of the age, nationality, and attendance verifications to determine overall eligibility.

## Setup

To set up the project and compile the circuits, follow these steps:

1. **Clone the Repository**:  
   ```bash
   git clone https://github.com/your-repository/circuits
   cd circuits
   ```

2. **Install Dependencies**:  
   Ensure that you have `nargo` and Noir installed. Follow the [official Noir installation guide](https://noir-lang.org/docs/installation) if needed.

3. **Compile Circuits**:  
   Navigate to each circuit's directory and compile it using `nargo`:
   ```bash
   cd age_verification
   nargo compile
   cd ../nationality
   nargo compile
   cd ../attendance
   nargo compile
   cd ../multimodal
   nargo compile
   ```
