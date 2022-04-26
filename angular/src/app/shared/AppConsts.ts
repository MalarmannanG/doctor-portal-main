export class AppConsts {

    static readonly tenancyNamePlaceHolderInUrl = '{TENANCY_NAME}';

    static remoteServiceBaseUrl: string;
    static remoteServiceBaseUrlFormat: string;
    static appBaseUrl: string;
    static appBaseHref: string; // returns angular's base-href parameter value if used during the publish
    static appBaseUrlFormat: string;
    static recaptchaSiteKey: string;
    static subscriptionExpireNootifyDayCount: number;

    static localeMappings: any = [];

    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        defaultLocalizationSourceName: 'CorsanPortal'
    };

    static readonly authorization = {
        encrptedAuthTokenName: 'enc_auth_token',
        userSupplierId: 'user_supplier_id',
        userCustomerId: 'user_customer_id',
        userCustomer: 'user_customer'
    };

    static readonly grid = {
        defaultPageSize: 10
    };

    static readonly Roles = {
        Admin: "Admin",
        Super_Admin: "Super Admin",
        Supplier_Admin: "Supplier Admin",
        Supplier_Standard_User: "Supplier Standard User",
        Customer_Admin: "Customer Admin",
        Customer_Standard_User: "Customer Standard User",
        Business_Admin: "Business Admin",
        Business_Standard_User: "Business Standard User",
        Sales_Representative: "Sales Representative"
    };
}
