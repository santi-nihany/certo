fn main(participation_status: pub bool, required_status: pub bool) -> pub bool {
    let has_participated = participation_status == required_status;
    has_participated
}
