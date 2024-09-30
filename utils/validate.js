export const validatePhoneNumber = (number) => {
    // Allow only 10 or 11 digits
    const phoneRegex = /^\d{10,11}$/;
    return phoneRegex.test(number);
}

export const errorsName = (editing, name, errors) => {
    if (editing && (name == '')) {
        errors.value.name = '이름: 필수 정보입니다.';
        return
    } 
    errors.value.name = '';
}

export const errorsPhone = async (editing, phoneCountry, phoneNumber, errors) => {
    if (editing && (phoneNumber == '' || phoneCountry == '')) {
        errors.value.phone = '휴대전화: 필수 정보입니다.';
        return
    } 
    
    if (phoneNumber !== '' && !validatePhoneNumber(phoneNumber)) {
        errors.value.phone = '휴대전화: 10~11자리 숫자를 입력하세요.';
        return
    }
    errors.value.phone = '';
}

export const errorsPostcode = (editing, postcode, errors) => {
    if (editing && (postcode == '')) {
        errors.value.postcode = '우편번호: 필수 정보입니다.';
        return
    } 

    errors.value.postcode = '';
}

export const errorsAddress = (editing, address, errors) => {
    if (editing && (address == '')) {
        errors.value.address = '주소: 필수 정보입니다.';
        return
    } 

    errors.value.address = '';
}

export const errorsDetailAddress = (editing, detailAddress, errors) => {
    if (editing && (detailAddress == '')) {
        errors.value.detailAddress = '상세주소: 필수 정보입니다.';
        return
    } 

    errors.value.detailAddress = '';
}

export const errorsDepositorName = (editing, depositorName, errors) => {
    if (editing && (depositorName == '')) {
        errors.value.depositorName = '입금자명: 필수 정보입니다.';
        return
    } 

    errors.value.depositorName = '';
}

export const errorsOrderQuantity = (editing, orderQuantity, errors) => {
    if (editing && (orderQuantity == '')) {
        errors.value.orderQuantity = '주문수량: 필수 정보입니다.';
        return
    } 

    errors.value.orderQuantity = '';
}


export const errorsSignIn = (editing, name, phoneCountry, phoneNumber, password, errors) => {
    if (editing.value && (phoneCountry.value == '' || phoneNumber.value == '')) {
        errors.value.signIn = '전화번호: 필수 정보입니다.';
        return
    } 
    if (editing.value && name.value == '') {
        errors.value.signIn = '이름: 필수 정보입니다.';
        return
    } 
    if (editing.value && password.value == '') {
        errors.value.signIn = '비밀번호: 필수 정보입니다.';
        return
    } 
    errors.value.signIn = '';
}


