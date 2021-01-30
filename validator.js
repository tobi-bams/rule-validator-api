//Array declarations
const requiredField = ['rule', 'data'];
const possibbleConditions = ['eq', 'neq', 'gt', 'gte', 'contains'];

//Main Validator
const validator = (body) => {
    const rule = body['rule'];
    const bodyData = body['data'];

    if(("rule" in body) && ("data" in body)){

        if(typeof rule === "object" & (typeof bodyData === "object" || typeof bodyData === 'string' || Array.isArray(bodyData))){
            
            const ruleFeild = typeof rule.field === 'string';
            
            const ruleCondition = (typeof rule.condition === 'string' && possibbleConditions.includes(rule.condition));
           
            const ruleConditionValue = (typeof rule.condition_value === 'string' || typeof rule.condition_value === 'number');
            
            if( ruleFeild && ruleCondition && ruleConditionValue){
                if(bodyData[rule.field]){
                    return validation(rule, bodyData);
                }
                else{
                    const feedback = {
                        mainFeedback: {
                            "message": `field ${rule.field} is missing from data.`,
                            "status": "error",
                            "data": null
                          }, 
                        status: 400 
                    }
                    return feedback;
                }
                
            }
            else{
                const feedback = {
                    mainFeedback: {
                        "message": "Invalid JSON payload passed.",
                        "status": "error",
                        "data": null
                      }, 
                    status: 400 
                }
                return feedback;
            }
           
        }
        else{
            return missingDataTypeValidator(rule, bodyData); 
        }
    }
    else{
        return missingrequiredFieldValidator(body);
    }
}

//Missing Required Field Validator Response
const missingrequiredFieldValidator = (body) => {
    const misssingField = requiredField.filter((key) => {
        if(!(body[key])){
            return key;
        }
    })

    const feedback = {
        status: 400,
        mainFeedback: {
            "message": `${misssingField.join(' and ')} is required.`,
            "status": "error",
            "data": null
        }
    }
    return feedback;
}

//Missing DataType Validator Response
const missingDataTypeValidator = (rule, bodyData) => {
    if(typeof rule !== 'object'){
        const feedback = {
            status: 400,
            mainFeedback: {
                "message": "rule should be an object.",
                "status": "error",
                "data": null
            }
        }
        return feedback;
    }
    else if(typeof bodyData !== 'object' || typeof bodyData !== 'string' || !Array.isArray(bodyData)){
        const feedback = {
            status: 400,
            mainFeedback: {
                "message": "data should be an object, a string or an array.",
                "status": "error",
                "data": null
            }
        }
        return feedback;
    }
}


//Conditional validator
const validation = (rule, bodyData) => {
    const fieldValue = bodyData[rule.field];
    const conditionValue = rule.condition_value;
    const condition = rule.condition;

    if(condition === 'eq'){
        if(fieldValue === conditionValue){
            return successfulValidation(rule, bodyData);
        }else{
            return errorValidation(rule, bodyData);
        }
    }

    if(condition === 'neq'){
        if(fieldValue !== conditionValue){
            return successfulValidation(rule, bodyData); 
        }
        else {
            return errorValidation(rule, bodyData); 
        }
    }
    
    if(condition === 'gt'){
        if(fieldValue > conditionValue){
            return successfulValidation(rule, bodyData);
        }
        else {
            return errorValidation(rule, bodyData); 
        }
    }

    if(condition === 'gte'){
        if(fieldValue >= conditionValue){
            return successfulValidation(rule, bodyData);
        }
        else {
            return errorValidation(rule, bodyData); 
        }
    }

    if(condition === "contains"){
        if(conditionValue.includes(fieldValue)){
            return successfulValidation(rule, bodyData); 
        }
        else {
            return errorValidation(rule, bodyData); 
        }
    }
}

//Successful Validation Response
const successfulValidation = (rule, bodyData) => {
    const feedback = {
        status: 201,
        mainFeedback: {
            "message": `field ${rule.field} successfully validated.`,
            "status": "success",
            "data": {
              "validation": {
                "error": false,
                "field": `${rule.field}`,
                "field_value": bodyData[rule.field],
                "condition": `${rule.condition}`,
                "condition_value": rule.condition_value
              }
            }
          }
    }
    return feedback
}

//Failed Validation Response
const errorValidation = (rule, bodyData) => {
    const feedback = {
        status: 201,
        mainFeedback:{
            "message": `field ${rule.field} failed validation.`,
            "status": "error",
            "data": {
              "validation": {
                "error": true,
                "field": `${rule.field}`,
                "field_value": bodyData[rule.field],
                "condition": `${rule.condition}`,
                "condition_value": rule.condition_value 
              }
            }
          }
    }
    return feedback
}

//Validator Export
module.exports = validator;

