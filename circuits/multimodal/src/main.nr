fn main(age: pub u8, min_age: pub u8, max_age: pub u8, nationality: pub u8, required_nationality: pub u8, gender: pub u8, required_gender: pub u8) -> pub bool {
    let is_within_age_range = (age >= min_age) & (age <= max_age);
    let is_nationality_valid = nationality == required_nationality;
    let is_gender_valid = gender == required_gender;
    
    let is_eligible = is_within_age_range & is_nationality_valid & is_gender_valid;
    is_eligible
}
