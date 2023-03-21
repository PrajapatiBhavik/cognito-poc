from dotenv import load_dotenv
import os
from jose import jwt
from flask import Flask, request
import requests
import json
from flask_cors import CORS

load_dotenv(override=True)

app = Flask(__name__)
CORS(app)
app.secret_key = "AWS Cognito Authentication With Lamda"
# Verify token Endpoint


@app.post("/verifyToken")
def decode_verify_token():
    """
    {
       "keys":[
          {
             "alg":"RS256",
             "e":"AQAB",
             "kid":"hmlIi0ie4TJZKVbGCbWV20w1qqsNPyjoFhau1MfS+i4=",
             "kty":"RSA",
             "n":"2IASx_zrg9cIuj1I4LblmQLGHfnNWSManTbvMXjp9_LI6X5fyv2pjLHsOAjga_vX3776JkSDx5Fv6IoSWWlrwytSlb57y-0GCvox0mK_KEczFzBVJUOhJiHmZKhTcMwf2NSU4yJ6srzuoKnSuq1q3kLzKgRSOQWIUycufvmhqaVu92Jr0vCklTKu2qgD7j1WmRYN9m0dylYpaI2Vybol8zaCcP3ft_eW-S_W9e0IjKOmH-KZ6_NHJCtfo92KgrBYC7W0kcBsXJymmarXVuvPwxY33-Mz7tTnVJHuKJsNhQWe8615G6VyOxYHRir1tn0p6Bl6Y3jnw8pitJGINjL2pw",
             "use":"sig"
          },
          {
             "alg":"RS256",
             "e":"AQAB",
             "kid":"osr5Yj3xOSkxzHx4P9uDT7kYq0T92OUruEkimanAHec=",
             "kty":"RSA",
             "n":"qwAyACmQZ_mece3vKnte6p3BTeOvmq47F1JjNtfV7pbQyJxvFycDt5l0CDGqBoFwm3bIU-nweXFJ_dCVFiJ3M_nGm4OcBqKp16tzhQy6Twc-x1tcabmfCT2Vb1GCOnlW3dJdRY3SuHq-wHboHyPg18e4y4qZ8bC0qBRMdc5MWdUC2EuHYds7s9FZES7ECMfNpFhYq5LLG_DqxPArgl1d86M4xviJVr_0CBZJZ3sMWosxZOWpJpEEkjbrPTYHtYIgOM3jy5kknj1G8I_tz_qzzkYk1NCXODgGiLtnAqOAh1v8E7t5OM5SSTlHI42CxJY5ClJayCBpyLCszEy312Taow",
             "use":"sig"
          }
       ]
    }
    """
    # build the URL where the public keys are
    jwks_url = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_TtHD2vd5X/.well-known/jwks.json".format(
        "us-east-1", os.getenv("USER_POOL_ID")
    )
    # get the keys
    jwks = requests.get(jwks_url).json()
    token = request.json["token"]
    decoded_token = jwt.decode(
        token, key=jwks, options={"verify_aud": False, "verify_signature": False}
    )
    #     pprint(decoded_token)
    return decoded_token


# Admin Create User Endpoint
@app.post("/admincreateuser")
def cognito_Admin_create():
    try:
        url = f"{os.getenv('API_GATEWAY_URL')}/createadmincognitouser"

        payload = json.dumps({"email": request.json["email"]})
        headers = {
            "Authorization": request.headers["Authorization"],
            "Content-Type": "application/json",
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        return json.dumps({"success": "True", "response": response.text})
    except Exception as e:
        return f"Exception Occered : {str(e)}"


# Login Endpoint


@app.post("/login")
def cognito_login():
    try:
        url = f"{os.getenv('API_GATEWAY_URL')}/login"

        payload = json.dumps(
            {"email": request.json["email"], "password": request.json["password"]}
        )
        headers = {"Content-Type": "application/json"}

        response = requests.request("POST", url, headers=headers, data=payload)

        res = response.json()
        j_data = json.loads(res["body"])

        os.environ["ACCESS_TOKEN"] = j_data["data"]["access_token"]
        os.environ["ID_TOKEN"] = j_data["data"]["id_token"]

        return json.dumps({"success": "True", "response": response.text})
    except Exception as e:
        return f"Exception Occered : {str(e)}"


# Forgot Password Endpoint


@app.post("/forgotpassword")
def forgetPassword():
    try:
        url = f"{os.getenv('API_GATEWAY_URL')}/forgotpassword"

        payload = json.dumps({"email": request.json["email"]})
        headers = {"Content-Type": "application/json"}

        response = requests.request("POST", url, headers=headers, data=payload)

        return json.dumps({"success": "True", "response": response.text})
    except Exception as e:
        return f"Exception Occered : {str(e)}"


# Confirm Forgot Password Endpoint


@app.post("/confirmpasswordchange")
def confirmPasswordChange():
    try:
        url = f"{os.getenv('API_GATEWAY_URL')}/confirmpasswordchange"

        payload = json.dumps(
            {
                "email": request.json["email"],
                "new_password": request.json["new_password"],
                "code": request.json["code"],
            }
        )
        headers = {"Content-Type": "application/json"}

        response = requests.request("POST", url, headers=headers, data=payload)

        return json.dumps({"success": "True", "response": response.text})
    except Exception as e:
        return f"Exception Occered : {str(e)}"


# Change Password Endpoint


@app.post("/changePassword")
def changePassword():
    try:
        url = f"{os.getenv('API_GATEWAY_URL')}/changepassword"
        payload = json.dumps(
            {
                "pre_password": request.json["pre_password"],
                "new_password": request.json["new_password"],
                "acc_token": request.json["acc_token"],
                "email": request.json["email"],
            }
        )
        headers = {
            "Authorization": request.headers["Authorization"],
            "Content-Type": "application/json",
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        return json.dumps({"success": "True", "response": response.text})
    except Exception as e:
        return f"Exception Occered : {str(e)}"


# Admin Disable User Endpoint
@app.post("/disableadmincognitouser")
def disableAdminCogniToUser():
    try:
        url = f"{os.getenv('API_GATEWAY_URL')}/disableadmincognitouser"

        payload = json.dumps({"email": request.json["email"]})
        headers = {
            "Authorization": request.headers["Authorization"],
            "Content-Type": "application/json",
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        return json.dumps({"success": "True", "response": response.text})
    except Exception as e:
        return f"Exception Occured : {str(e)}"


# Admin Enable User Endpoint
@app.post("/enableadmincognitouser")
def enableAdminCogniToUser():
    try:
        url = f"{os.getenv('API_GATEWAY_URL')}/enablecognitouser"

        payload = json.dumps({"email": request.json["email"]})
        headers = {
            "Authorization": request.headers["Authorization"],
            "Content-Type": "application/json",
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        return json.dumps({"success": "True", "response": response.text})
    except Exception as e:
        return f"Exception Occured : {str(e)}"


# Admin Delete User Endpoint
@app.post("/deleteadmincognitouser")
def deleteAdminCogniToUser():
    try:
        url = f"{os.getenv('API_GATEWAY_URL')}/deleteadmincognitouser"

        payload = json.dumps({"email": request.json["email"]})
        headers = {
            "Authorization": request.headers["Authorization"],
            "Content-Type": "application/json",
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        return json.dumps({"success": "True", "response": response.text})
    except Exception as e:
        return f"Exception Occered : {str(e)}"


# Get User Endpoint
@app.post("/getUser")
def getUser():
    try:
        url = f"{os.getenv('API_GATEWAY_URL')}/getuser"

        payload = json.dumps({"acc_token": request.json["acc_token"]})
        headers = {
            "Authorization": request.headers["Authorization"],
            "Content-Type": "application/json",
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        return json.dumps({"success": "True", "response": response.text})
    except Exception as e:
        return f"Exception Occered : {str(e)}"



# Global Signout Endpoint
@app.post("/globallogout")
def globalLogout():
    try:
        url = f"{os.getenv('API_GATEWAY_URL')}/globallogout"

        payload = json.dumps({"acc_token": request.json["acc_token"]})
        headers = {
            "Authorization": request.headers["Authorization"],
            "Content-Type": "application/json",
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        return json.dumps({"success": "True", "response": response.text})
    except Exception as e:
        return f"Exception Occered : {str(e)}"


# Admin Global Signout Endpoint
@app.post("/adminuserglobalsignout")
def adminUserGlobalSignout():
    try:
        url = f"{os.getenv('API_GATEWAY_URL')}/adminuserglobalsignout"

        payload = json.dumps({"email": request.json["email"]})
        headers = {
            "Authorization": request.headers["Authorization"],
            "Content-Type": "application/json",
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        return json.dumps({"success": "True", "response": response.text})
    except Exception as e:
        return f"Exception Occered : {str(e)}"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
