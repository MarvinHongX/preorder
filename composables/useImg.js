export const useImg = () => {
    const logoUrl = computed(() => {
        return `/layout/images/logo.svg`;
    });
    const gotoUrl = computed(() => {
        return `/layout/images/goto.svg`;
    });
    const expandUrl = computed(() => {
        return `/layout/images/expand.svg`;
    });
    const foldUrl = computed(() => {
        return `/layout/images/fold.svg`;
    });
    const deliveryInfoUrl = computed(() => {
        return `/layout/images/deliveryInfo.svg`;
    });
    const refundPolicyUrl = computed(() => {
        return `/layout/images/refundPolicy.svg`;
    });
    const reserveFundsUrl = computed(() => {
        return `/layout/images/reserveFunds.svg`;
    });
    const myOrderUrl = computed(() => {
        return `/layout/images/myOrder.svg`;
    });
    const customerOrderUrl = computed(() => {
        return `/layout/images/customerOrder.svg`;
    });
    const pendingPaymentUrl = computed(() => {
        return `/layout/images/pendingPayment.svg`;
    });
    const roam01Url = computed(() => {
        return `/layout/images/roam/roam_01.jpg`;
    });
    const roam02Url = computed(() => {
        return `/layout/images/roam/roam_02.jpg`;
    });
    const roam03Url = computed(() => {
        return `/layout/images/roam/roam_03.jpg`;
    });
    const roam04Url = computed(() => {
        return `/layout/images/roam/roam_04.jpg`;
    });
    const roam05Url = computed(() => {
        return `/layout/images/roam/roam_05.jpg`;
    });
    const roam06Url = computed(() => {
        return `/layout/images/roam/roam_06.jpg`;
    });
    const roam07Url = computed(() => {
        return `/layout/images/roam/roam_07.jpg`;
    });
    const adminUrl = computed(() => {
        return `/layout/images/agency/admin.svg`;
    });
    const agencyUrl = computed(() => {
        return `/layout/images/agency/agency.svg`;
    });
    const newAgencyUrl = computed(() => {
        return `/layout/images/agency/newAgency.svg`;
    });
    return {
        logoUrl,
        gotoUrl,
        expandUrl,
        foldUrl,
        deliveryInfoUrl,
        refundPolicyUrl,
        reserveFundsUrl,
        myOrderUrl,
        customerOrderUrl, 
        pendingPaymentUrl,
        roam01Url,
        roam02Url,
        roam03Url,
        roam04Url,
        roam05Url,
        roam06Url,
        roam07Url,
        adminUrl,
        agencyUrl,
        newAgencyUrl
    };
};

